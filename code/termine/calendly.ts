// Verbindung zu Calendly über die offizielle API (api.calendly.com).
// Nötige Secrets in Replit:
//   CALENDLY_TOKEN       Persönlicher Zugriffstoken (Calendly > Integrationen > API und Webhooks)
//   CALENDLY_EVENT_TYPE  optional: Name, Slug oder URI des Termintyps, z. B. "erstanalyse"
// Ohne CALENDLY_TOKEN ist die Online-Terminbuchung ausgeblendet.

const API_BASE = (process.env["CALENDLY_API_BASE"] ?? "https://api.calendly.com").replace(/\/$/, "");
const TIMEOUT_MS = 10_000;

export type Termintyp = {
  uri: string;
  name: string;
  dauer: number;
  buchungsLink: string | null;
  ort: { kind: string; location?: string } | null;
  fragen: { name: string; position: number; required: boolean }[];
};

export type BuchungsDaten = {
  start: string;
  name: string;
  email: string;
  unternehmen: string;
  telefon?: string;
  nachricht?: string;
  zeitzone: string;
};

export type BuchungsErgebnis =
  | { ok: true; verschiebenUrl: string | null; absagenUrl: string | null }
  | { ok: false; grund: "vergeben" | "telefon" | "fehler" };

export class CalendlyFehler extends Error {
  constructor(public status: number, public body: unknown) {
    super(`Calendly ${status}`);
  }
}

function token(): string | null {
  const t = process.env["CALENDLY_TOKEN"]?.trim();
  return t ? t : null;
}

export function calendlyAktiv(): boolean {
  return token() !== null;
}

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const t = token();
  if (!t) throw new CalendlyFehler(0, "kein Token");
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${t}`, "Content-Type": "application/json", ...(init.headers ?? {}) },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  const text = await res.text();
  let body: unknown = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  if (!res.ok) throw new CalendlyFehler(res.status, body);
  return body as T;
}

type RohTermintyp = {
  uri: string;
  name: string;
  slug?: string;
  active?: boolean;
  duration: number;
  scheduling_url?: string;
  locations?: { kind: string; location?: string }[] | null;
  custom_questions?: { name: string; position: number; enabled: boolean; required: boolean }[];
};

let typCache: { wert: Termintyp; bis: number } | null = null;

/** Ermittelt den Termintyp für die Erstanalyse und merkt ihn sich 10 Minuten. */
export async function termintyp(): Promise<Termintyp> {
  if (typCache && typCache.bis > Date.now()) return typCache.wert;
  const hinweis = process.env["CALENDLY_EVENT_TYPE"]?.trim() ?? "";
  let roh: RohTermintyp | undefined;
  if (/^https:\/\/api\.calendly\.com\/event_types\//.test(hinweis)) {
    roh = (await api<{ resource: RohTermintyp }>(hinweis.replace("https://api.calendly.com", ""))).resource;
  } else {
    const me = await api<{ resource: { uri: string } }>("/users/me");
    const liste = await api<{ collection: RohTermintyp[] }>(`/event_types?user=${encodeURIComponent(me.resource.uri)}&active=true&count=100`);
    const aktive = liste.collection.filter((e) => e.active !== false);
    const h = hinweis.toLowerCase();
    roh = (h && aktive.find((e) => e.slug?.toLowerCase() === h || e.name.toLowerCase().includes(h)))
      || aktive.find((e) => /erstanalyse/i.test(e.name))
      || aktive[0];
  }
  if (!roh) throw new CalendlyFehler(404, "kein aktiver Termintyp");
  const wert: Termintyp = {
    uri: roh.uri,
    name: roh.name,
    dauer: roh.duration,
    buchungsLink: roh.scheduling_url ?? null,
    ort: roh.locations && roh.locations.length > 0 ? roh.locations[0]! : null,
    fragen: (roh.custom_questions ?? []).filter((q) => q.enabled).map((q) => ({ name: q.name, position: q.position, required: q.required })),
  };
  typCache = { wert, bis: Date.now() + 10 * 60_000 };
  return wert;
}

const zeitCache = new Map<string, { slots: string[]; bis: number }>();

/** Freie Startzeiten (UTC) zwischen von und bis. Der Zeitraum darf höchstens 7 Tage umfassen. */
export async function freieZeiten(von: Date, bis: Date): Promise<string[]> {
  const typ = await termintyp();
  const key = `${typ.uri}|${von.toISOString()}|${bis.toISOString()}`;
  const hit = zeitCache.get(key);
  if (hit && hit.bis > Date.now()) return hit.slots;
  const q = new URLSearchParams({ event_type: typ.uri, start_time: von.toISOString(), end_time: bis.toISOString() });
  const res = await api<{ collection: { status: string; start_time: string }[] }>(`/event_type_available_times?${q}`);
  const slots = res.collection.filter((s) => s.status === "available").map((s) => new Date(s.start_time).toISOString()).sort();
  zeitCache.set(key, { slots, bis: Date.now() + 60_000 });
  if (zeitCache.size > 200) for (const [k, v] of zeitCache) if (v.bis <= Date.now()) zeitCache.delete(k);
  return slots;
}

/** Ob für den Ort eine Telefonnummer der eingeladenen Person gebraucht wird. */
export function telefonPflicht(typ: Termintyp): boolean {
  return typ.ort?.kind === "outbound_call";
}

function antwortFuer(frage: string, d: BuchungsDaten): string | undefined {
  if (/unternehmen|firma|company/i.test(frage)) return d.unternehmen;
  if (/telefon|phone|handy|mobil/i.test(frage)) return d.telefon || undefined;
  if (/nachricht|anliegen|baustelle|thema|frage|notiz|message|share/i.test(frage)) return d.nachricht || undefined;
  return undefined;
}

/** Legt den Termin bei Calendly an. Calendly verschickt danach Bestätigung und Kalendereintrag. */
export async function buchen(d: BuchungsDaten): Promise<BuchungsErgebnis> {
  const typ = await termintyp();
  if (telefonPflicht(typ) && !d.telefon) return { ok: false, grund: "telefon" };
  const body: Record<string, unknown> = {
    event_type: typ.uri,
    start_time: d.start,
    invitee: { name: d.name, email: d.email, timezone: d.zeitzone },
  };
  if (typ.ort) {
    const ort: { kind: string; location?: string } = { kind: typ.ort.kind };
    if (typ.ort.kind === "outbound_call") ort.location = d.telefon;
    else if (typ.ort.kind === "ask_invitee") ort.location = d.telefon ? `Telefon: ${d.telefon}` : "Wird per E-Mail abgestimmt";
    else if (typ.ort.location) ort.location = typ.ort.location;
    body["location"] = ort;
  }
  const antworten = typ.fragen
    .map((f) => ({ question: f.name, answer: antwortFuer(f.name, d), position: f.position }))
    .filter((a): a is { question: string; answer: string; position: number } => !!a.answer);
  if (antworten.length) body["questions_and_answers"] = antworten;
  try {
    const res = await api<{ resource?: { cancel_url?: string; reschedule_url?: string } }>("/invitees", { method: "POST", body: JSON.stringify(body) });
    zeitCache.clear(); // gebuchter Termin soll sofort nicht mehr als frei erscheinen
    return { ok: true, verschiebenUrl: res.resource?.reschedule_url ?? null, absagenUrl: res.resource?.cancel_url ?? null };
  } catch (e) {
    if (e instanceof CalendlyFehler && [400, 404, 409, 422].includes(e.status)) {
      const text = JSON.stringify(e.body ?? "").toLowerCase();
      if (e.status === 409 || /no longer available|not available|unavailable|already booked|taken|time slot|start_time/.test(text)) {
        zeitCache.clear();
        return { ok: false, grund: "vergeben" };
      }
    }
    throw e;
  }
}

/** Nur für Tests: Zwischenspeicher leeren. */
export function cacheLeeren() {
  typCache = null;
  zeitCache.clear();
}
