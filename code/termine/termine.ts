import { Router, type IRouter } from "express";
import { terminSchema, TERMIN_FEHLER, TERMIN_NICHT_VERFUEGBAR, TERMIN_SEND_ERROR, TERMIN_VERGEBEN, type TerminFrei, type TerminGebucht, type TerminStatus } from "@workspace/api-zod";
import { buchen, calendlyAktiv, freieZeiten, telefonPflicht, termintyp } from "../lib/calendly";

const ZONE = "Europe/Berlin";
const TAG_MS = 86_400_000;
const MAX_TAGE_VORAUS = 120;

/** Versatz der Berliner Zeit zu UTC in Millisekunden für einen Zeitpunkt. */
function berlinOffset(utcMs: number): number {
  const teile = new Intl.DateTimeFormat("en-US", { timeZone: ZONE, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" })
    .formatToParts(new Date(utcMs))
    .reduce<Record<string, number>>((a, p) => { if (p.type !== "literal") a[p.type] = Number(p.value); return a; }, {});
  const alsUtc = Date.UTC(teile["year"]!, teile["month"]! - 1, teile["day"]!, teile["hour"]!, teile["minute"]!, teile["second"]!);
  return alsUtc - Math.floor(utcMs / 1000) * 1000;
}

/** UTC-Zeitpunkt von Mitternacht (Berlin) für ein Datum JJJJ-MM-TT. */
function berlinMitternacht(datum: string): number {
  const [y, m, d] = datum.split("-").map(Number) as [number, number, number];
  const geraten = Date.UTC(y, m - 1, d);
  let utc = geraten - berlinOffset(geraten);
  utc = geraten - berlinOffset(utc);
  return utc;
}

function heuteBerlin(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

function plusTage(datum: string, tage: number): string {
  const [y, m, d] = datum.split("-").map(Number) as [number, number, number];
  return new Date(Date.UTC(y, m - 1, d + tage)).toISOString().slice(0, 10);
}

const router: IRouter = Router();

router.get("/termine/status", async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (!calendlyAktiv()) { res.json({ aktiv: false } satisfies TerminStatus); return; }
  try {
    const typ = await termintyp();
    res.json({ aktiv: true, name: typ.name, dauer: typ.dauer, ort: typ.ort?.kind ?? null, telefonPflicht: telefonPflicht(typ), buchungsLink: typ.buchungsLink } satisfies TerminStatus);
  } catch {
    req.log.error("Calendly-Termintyp nicht abrufbar.");
    res.json({ aktiv: false } satisfies TerminStatus);
  }
});

router.get("/termine/frei", async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (!calendlyAktiv()) { res.status(503).json({ message: TERMIN_NICHT_VERFUEGBAR }); return; }
  const heute = heuteBerlin();
  const wunsch = typeof req.query["von"] === "string" && /^\d{4}-\d{2}-\d{2}$/.test(req.query["von"]) ? req.query["von"] : heute;
  if (wunsch < heute || wunsch > plusTage(heute, MAX_TAGE_VORAUS)) { res.status(400).json({ message: TERMIN_NICHT_VERFUEGBAR }); return; }
  const bisDatum = plusTage(wunsch, 7);
  const start = Math.max(berlinMitternacht(wunsch), Date.now() + 60_000);
  const ende = berlinMitternacht(bisDatum);
  try {
    const slots = ende - start > 0 && ende - start <= 7 * TAG_MS + 2 * 3_600_000 ? await freieZeiten(new Date(start), new Date(Math.min(ende, start + 7 * TAG_MS))) : [];
    res.json({ von: wunsch, bis: bisDatum, slots } satisfies TerminFrei);
  } catch {
    req.log.error("Freie Termine bei Calendly nicht abrufbar.");
    res.status(502).json({ message: TERMIN_NICHT_VERFUEGBAR });
  }
});

router.post("/termine", async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (!calendlyAktiv()) { res.status(503).json({ message: TERMIN_NICHT_VERFUEGBAR }); return; }
  if (req.body && typeof req.body.website === "string" && req.body.website.trim()) {
    req.log.warn("Spam-Termin verworfen: Honeypot ausgefüllt.");
    res.status(400).json({ message: TERMIN_SEND_ERROR });
    return;
  }
  const parsed = terminSchema.safeParse(req.body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && ["name", "unternehmen", "email", "telefon", "nachricht", "start"].includes(field)) fieldErrors[field] ??= issue.message;
    }
    res.status(400).json({ message: TERMIN_SEND_ERROR, fieldErrors });
    return;
  }
  const d = parsed.data;
  if (Date.now() - d.angezeigtAm < 2500) {
    req.log.warn("Termin verworfen: Mindest-Ausfüllzeit unterschritten.");
    res.status(400).json({ message: TERMIN_SEND_ERROR });
    return;
  }
  try {
    const ergebnis = await buchen({
      start: new Date(d.start).toISOString(),
      name: d.name,
      email: d.email,
      unternehmen: d.unternehmen,
      telefon: d.telefon || undefined,
      nachricht: d.nachricht || undefined,
      zeitzone: d.zeitzone || ZONE,
    });
    if (!ergebnis.ok) {
      if (ergebnis.grund === "vergeben") { res.status(409).json({ message: TERMIN_VERGEBEN }); return; }
      if (ergebnis.grund === "telefon") { res.status(400).json({ message: TERMIN_SEND_ERROR, fieldErrors: { telefon: TERMIN_FEHLER.telefonPflicht } }); return; }
    } else {
      req.log.info("Termin bei Calendly gebucht.");
      res.status(201).json({ gebucht: true, start: d.start, verschiebenUrl: ergebnis.verschiebenUrl, absagenUrl: ergebnis.absagenUrl } satisfies TerminGebucht);
      return;
    }
  } catch {
    req.log.error("Buchung bei Calendly fehlgeschlagen.");
  }
  res.status(502).json({ message: TERMIN_SEND_ERROR });
});

export default router;
