import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'wouter';
import { CalendarCheck, Check, ChevronLeft, ChevronRight, Clock, Loader2, MapPin } from 'lucide-react';
import { ANFRAGE_RATE_ERROR } from '@workspace/api-zod/anfrage';
import {
  terminSchema, TERMIN_FEHLER, TERMIN_NICHT_VERFUEGBAR, TERMIN_SEND_ERROR, TERMIN_VERGEBEN,
  type TerminFrei, type TerminGebucht, type TerminStatus,
} from '@workspace/api-zod/termin';
import { kontaktContent as K } from '@/content/site';
import './termin.css';

const ZONE = 'Europe/Berlin';
const MAX_WOCHEN = 16;
const MIN_SHOWN_MS = 2500;
const ORT: Record<string, string> = {
  google_conference: 'Google Meet',
  zoom_conference: 'Zoom',
  microsoft_teams_conference: 'Microsoft Teams',
  webex_conference: 'Webex',
  gotomeeting_conference: 'GoTo Meeting',
  outbound_call: 'Telefon, wir rufen Sie an',
  inbound_call: 'Telefon',
  physical: 'Vor Ort',
};

// ---------- Status: ist die Online-Buchung eingerichtet? (einmal pro Seitenaufruf) ----------
let statusAnfrage: Promise<TerminStatus> | null = null;
export function useTerminStatus(): TerminStatus | null {
  const [status, setStatus] = useState<TerminStatus | null>(null);
  useEffect(() => {
    statusAnfrage ??= fetch('/api/termine/status', { headers: { Accept: 'application/json' } })
      .then(async (r) => { const body = await r.json().catch(() => null); return r.ok && body ? (body as TerminStatus) : { aktiv: false as const }; })
      .catch(() => ({ aktiv: false as const }));
    let aktiv = true;
    void statusAnfrage.then((s) => { if (aktiv) setStatus(s); });
    return () => { aktiv = false; };
  }, []);
  return status;
}

// ---------- Datum und Zeit in deutscher Zeit ----------
const datumBerlin = (d: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
const plusTage = (datum: string, n: number) => {
  const [y, m, d] = datum.split('-').map(Number) as [number, number, number];
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
};
const alsMittag = (datum: string) => new Date(`${datum}T12:00:00Z`);
const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('de-DE', { timeZone: ZONE, ...o }).format(d);
const zeit = (iso: string) => fmt(new Date(iso), { hour: '2-digit', minute: '2-digit' });
const terminLang = (iso: string) => `${fmt(new Date(iso), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}, ${zeit(iso)} Uhr`;
const wocheLabel = (von: string) => `${fmt(alsMittag(von), { day: 'numeric', month: 'short' })} bis ${fmt(alsMittag(plusTage(von, 6)), { day: 'numeric', month: 'short' })}`;

type Feld = 'name' | 'unternehmen' | 'email' | 'telefon' | 'nachricht';
const FELDER: Feld[] = ['name', 'unternehmen', 'email', 'telefon', 'nachricht'];
type Werte = Record<Feld, string>;
const LEER: Werte = { name: '', unternehmen: '', email: '', telefon: '', nachricht: '' };

/** Eigene Terminbuchung im Kischkel-Design. Die Buchung legt unser Server bei Calendly an. */
export function TerminBuchung({ status }: { status: Extract<TerminStatus, { aktiv: true }> }) {
  const heute = useMemo(() => datumBerlin(new Date()), []);
  const [von, setVon] = useState(heute);
  const [slots, setSlots] = useState<string[] | null>(null);
  const [laden, setLaden] = useState(false);
  const [ladeFehler, setLadeFehler] = useState(false);
  const [tag, setTag] = useState<string | null>(null);
  const [start, setStart] = useState<string | null>(null);
  const [schritt, setSchritt] = useState<'zeit' | 'daten' | 'fertig'>('zeit');
  const [hinweis, setHinweis] = useState('');
  const [werte, setWerte] = useState<Werte>(LEER);
  const [fehler, setFehler] = useState<Partial<Record<Feld, string>>>({});
  const [sende, setSende] = useState(false);
  const [alarm, setAlarm] = useState('');
  const [gebucht, setGebucht] = useState<TerminGebucht | null>(null);
  const shownAt = useRef(Date.now());
  const honeypot = useRef<HTMLInputElement>(null);
  const datenTitel = useRef<HTMLHeadingElement>(null);
  const fertigRef = useRef<HTMLDivElement>(null);
  const alarmRef = useRef<HTMLDivElement>(null);
  const zeitenRef = useRef<HTMLDivElement>(null);
  const fokusNach = useRef<'daten' | 'fertig' | 'alarm' | 'zeiten' | null>(null);
  const ladeNr = useRef(0);

  const ortText = status.ort ? ORT[status.ort] ?? null : null;

  const ladeWoche = useCallback(async (w: string, autoTag = true) => {
    const nr = ++ladeNr.current;
    setLaden(true);
    setLadeFehler(false);
    try {
      const r = await fetch(`/api/termine/frei?von=${w}`, { headers: { Accept: 'application/json' } });
      const body = await r.json().catch(() => null);
      if (!r.ok || !body) throw new Error(String(r.status));
      const data = body as TerminFrei;
      if (nr !== ladeNr.current) return;
      setSlots(data.slots);
      if (autoTag) {
        const ersterTag = data.slots[0] ? datumBerlin(new Date(data.slots[0])) : null;
        setTag(ersterTag);
      }
    } catch {
      if (nr !== ladeNr.current) return;
      setSlots(null);
      setLadeFehler(true);
    } finally {
      if (nr === ladeNr.current) setLaden(false);
    }
  }, []);

  useEffect(() => { void ladeWoche(von); }, [von, ladeWoche]);

  useEffect(() => {
    const ziel = fokusNach.current;
    fokusNach.current = null;
    if (ziel === 'daten') datenTitel.current?.focus();
    if (ziel === 'fertig') fertigRef.current?.focus();
    if (ziel === 'alarm') alarmRef.current?.focus();
    if (ziel === 'zeiten') zeitenRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
  });

  const tage = useMemo(() => Array.from({ length: 7 }, (_, i) => plusTage(von, i)), [von]);
  const proTag = useMemo(() => {
    const m = new Map<string, string[]>();
    for (const s of slots ?? []) {
      const d = datumBerlin(new Date(s));
      m.set(d, [...(m.get(d) ?? []), s]);
    }
    return m;
  }, [slots]);
  const zeiten = tag ? proTag.get(tag) ?? [] : [];

  const zeitWaehlen = (s: string) => {
    setStart(s);
    setHinweis('');
    setAlarm('');
    setSchritt('daten');
    shownAt.current = Math.min(shownAt.current, Date.now());
    fokusNach.current = 'daten';
  };

  const pruefe = (w: Werte) => {
    const res = terminSchema.safeParse({
      name: w.name, unternehmen: w.unternehmen, email: w.email,
      ...(w.telefon.trim() ? { telefon: w.telefon } : {}),
      ...(w.nachricht.trim() ? { nachricht: w.nachricht } : {}),
      start: start ?? '', angezeigtAm: shownAt.current,
    });
    const f: Partial<Record<Feld, string>> = {};
    if (!res.success) {
      for (const issue of res.error.issues) {
        const k = issue.path[0] as Feld;
        if (FELDER.includes(k) && !f[k]) f[k] = issue.message;
      }
    }
    if (status.telefonPflicht && !w.telefon.trim()) f.telefon = TERMIN_FEHLER.telefonPflicht;
    return f;
  };

  const absenden = async (e: FormEvent) => {
    e.preventDefault();
    if (sende || !start) return;
    const f = pruefe(werte);
    setFehler(f);
    const erstes = FELDER.find((k) => f[k]);
    if (erstes) { document.getElementById(`tb-${erstes}`)?.focus(); return; }
    setSende(true);
    setAlarm('');
    try {
      const warten = shownAt.current + MIN_SHOWN_MS - Date.now();
      if (warten > 0) await new Promise((r) => setTimeout(r, warten + 50));
      const zeitzone = Intl.DateTimeFormat().resolvedOptions().timeZone || ZONE;
      const res = await fetch('/api/termine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          start, name: werte.name, unternehmen: werte.unternehmen, email: werte.email,
          ...(werte.telefon.trim() ? { telefon: werte.telefon } : {}),
          ...(werte.nachricht.trim() ? { nachricht: werte.nachricht } : {}),
          ...(honeypot.current?.value ? { website: honeypot.current.value } : {}),
          zeitzone: /^[A-Za-z0-9_+\-/]+$/.test(zeitzone) ? zeitzone : ZONE,
          angezeigtAm: shownAt.current,
        }),
      });
      let body: (Partial<TerminGebucht> & { message?: string; fieldErrors?: Record<string, string> }) | null = null;
      try { body = await res.json(); } catch { body = null; }
      if (res.status === 201 && body?.gebucht) {
        setGebucht(body as TerminGebucht);
        setSchritt('fertig');
        fokusNach.current = 'fertig';
        return;
      }
      if (res.status === 409) {
        setStart(null);
        setSchritt('zeit');
        setHinweis(TERMIN_VERGEBEN);
        void ladeWoche(von, false);
        fokusNach.current = 'zeiten';
        return;
      }
      if (body?.fieldErrors) {
        const f2: Partial<Record<Feld, string>> = {};
        for (const k of FELDER) if (typeof body.fieldErrors[k] === 'string') f2[k] = body.fieldErrors[k];
        if (Object.keys(f2).length) {
          setFehler(f2);
          const k = FELDER.find((x) => f2[x]);
          if (k) document.getElementById(`tb-${k}`)?.focus();
          return;
        }
      }
      setAlarm(res.status === 429 ? ANFRAGE_RATE_ERROR : body?.message || TERMIN_SEND_ERROR);
      fokusNach.current = 'alarm';
    } catch {
      setAlarm(TERMIN_SEND_ERROR);
      fokusNach.current = 'alarm';
    } finally {
      setSende(false);
    }
  };

  const aendern = (k: Feld) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...werte, [k]: e.target.value };
    setWerte(next);
    if (fehler[k]) setFehler(pruefe(next));
  };

  const feld = (k: Feld, label: string, pflicht: boolean, props: Record<string, string>, area = false) => {
    const err = fehler[k];
    const common = {
      id: `tb-${k}`, name: k, value: werte[k], onChange: aendern(k), className: 'kinput',
      'aria-invalid': err ? true : undefined, 'aria-describedby': err ? `tb-${k}-err` : undefined,
      'aria-required': pflicht || undefined, 'data-testid': `termin-input-${k}`, ...props,
    };
    return (
      <div className="kfield">
        <label htmlFor={`tb-${k}`} className="klabel">
          {label}
          {pflicht ? <span className="kstar" aria-hidden="true"> *</span> : <span className="font-normal"> (optional)</span>}
        </label>
        {area ? <textarea rows={3} {...common} /> : <input {...common} />}
        {err && <p id={`tb-${k}-err`} className="kerr">{err}</p>}
      </div>
    );
  };

  const meta = (
    <p className="tb-meta">
      <span><Clock size={16} aria-hidden="true" />{status.dauer} Minuten</span>
      {ortText && <span><MapPin size={16} aria-hidden="true" />{ortText}</span>}
    </p>
  );

  if (schritt === 'fertig' && gebucht) {
    return (
      <div className="ksuccess tb-fertig" role="status" tabIndex={-1} ref={fertigRef} data-testid="termin-gebucht">
        <div className="ksuccess-icon" aria-hidden="true"><Check size={32} /></div>
        <p>{K.terminFertig}</p>
        <p className="tb-fertig-zeit">{terminLang(gebucht.start)}</p>
        <p className="tb-fertig-text">{K.terminFertigText}</p>
        {(gebucht.verschiebenUrl || gebucht.absagenUrl) && (
          <p className="tb-fertig-links">
            {gebucht.verschiebenUrl && <a href={gebucht.verschiebenUrl} target="_blank" rel="noopener noreferrer">{K.terminVerschieben}</a>}
            {gebucht.absagenUrl && <a href={gebucht.absagenUrl} target="_blank" rel="noopener noreferrer">{K.terminAbsagen}</a>}
          </p>
        )}
      </div>
    );
  }

  if (schritt === 'daten' && start) {
    return (
      <form noValidate onSubmit={absenden} aria-busy={sende} data-testid="termin-form">
        <h3 className="tb-title" tabIndex={-1} ref={datenTitel}>{K.terminDatenTitel}</h3>
        <div className="tb-summary" data-testid="termin-auswahl">
          <CalendarCheck size={24} aria-hidden="true" />
          <div>
            <p className="tb-summary-t">{terminLang(start)}</p>
            {meta}
          </div>
          <button type="button" className="tb-aendern" onClick={() => { setSchritt('zeit'); fokusNach.current = 'zeiten'; }} data-testid="termin-aendern">{K.terminAendern}</button>
        </div>
        {alarm && <div className="kalert" role="alert" tabIndex={-1} ref={alarmRef} data-testid="termin-fehler">{alarm}</div>}
        <p className="mb-5 text-[15px]">{K.required}</p>
        <div className="kgrid2">
          {feld('name', 'Name', true, { type: 'text', autoComplete: 'name' })}
          {feld('unternehmen', 'Unternehmen', true, { type: 'text', autoComplete: 'organization' })}
        </div>
        <div className="kgrid2">
          {feld('email', 'Geschäftliche E-Mail-Adresse', true, { type: 'email', autoComplete: 'email', inputMode: 'email' })}
          {feld('telefon', status.telefonPflicht ? 'Telefonnummer für den Anruf' : 'Telefonnummer', status.telefonPflicht, { type: 'tel', autoComplete: 'tel', inputMode: 'tel' })}
        </div>
        {feld('nachricht', K.nachrichtLabel, false, { autoComplete: 'off' }, true)}
        <div className="khp" aria-hidden="true">
          <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </div>
        <button type="submit" className="btn btn-primary kbtn" disabled={sende} data-testid="termin-buchen">
          {sende ? (<><Loader2 size={20} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />{K.terminSende}</>) : K.terminBuchen}
        </button>
        <p className="kpriv">
          {K.terminDatenschutz}
          <Link href="/datenschutz">{K.privacyLink}</Link>.
        </p>
      </form>
    );
  }

  const ersteWoche = von <= heute;
  const letzteWoche = von >= plusTage(heute, 7 * (MAX_WOCHEN - 1));
  return (
    <div className="tb" data-testid="termin-kalender">
      <h3 className="tb-title">{K.terminTitel}</h3>
      {meta}
      <div className="tb-woche">
        <button type="button" className="tb-pfeil" onClick={() => { setVon(plusTage(von, -7)); setHinweis(''); }} disabled={ersteWoche || laden} aria-label="Vorherige Woche" data-testid="termin-woche-zurueck">
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <p className="tb-woche-label" aria-live="polite">{wocheLabel(von)}</p>
        <button type="button" className="tb-pfeil" onClick={() => { setVon(plusTage(von, 7)); setHinweis(''); }} disabled={letzteWoche || laden} aria-label="Nächste Woche" data-testid="termin-woche-vor">
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>
      <div className="tb-tage" role="group" aria-label="Tag wählen" data-testid="termin-tage">
        {tage.map((d) => {
          const n = proTag.get(d)?.length ?? 0;
          const mittag = alsMittag(d);
          return (
            <button
              key={d}
              type="button"
              className="tb-tag"
              aria-pressed={tag === d}
              disabled={laden || n === 0}
              onClick={() => { setTag(d); setHinweis(''); }}
              aria-label={`${fmt(mittag, { weekday: 'long', day: 'numeric', month: 'long' })}${n ? `, ${n} freie Termine` : ', keine freien Termine'}`}
              data-testid={`termin-tag-${d}`}
            >
              <span className="tb-tag-wt">{fmt(mittag, { weekday: 'short' }).replace('.', '')}</span>
              <span className="tb-tag-nr">{fmt(mittag, { day: 'numeric' })}</span>
              <span className="tb-tag-mo">{fmt(mittag, { month: 'short' }).replace('.', '')}</span>
            </button>
          );
        })}
      </div>
      <div className="tb-zeiten-box" aria-live="polite">
        {hinweis && <p className="kalert tb-hinweis" data-testid="termin-hinweis">{hinweis}</p>}
        {laden && <p className="tb-leer"><Loader2 size={18} className="animate-spin motion-reduce:animate-none" aria-hidden="true" /> {K.terminLaedt}</p>}
        {!laden && ladeFehler && (
          <p className="tb-leer" data-testid="termin-ladefehler">
            {TERMIN_NICHT_VERFUEGBAR}{' '}
            {status.buchungsLink && <a href={status.buchungsLink} target="_blank" rel="noopener noreferrer">{K.terminExtern}</a>}
          </p>
        )}
        {!laden && !ladeFehler && slots && slots.length === 0 && (
          <p className="tb-leer" data-testid="termin-woche-leer">
            {K.terminWocheLeer}{' '}
            {!letzteWoche && <button type="button" className="tb-link" onClick={() => setVon(plusTage(von, 7))}>{K.terminNaechsteWoche}</button>}
          </p>
        )}
        {!laden && !ladeFehler && zeiten.length > 0 && (
          <div className="tb-zeiten" role="group" aria-label={`Uhrzeit wählen, ${tag ? fmt(alsMittag(tag), { weekday: 'long', day: 'numeric', month: 'long' }) : ''}`} ref={zeitenRef} data-testid="termin-zeiten">
            {zeiten.map((s) => (
              <button key={s} type="button" className="tb-zeit" onClick={() => zeitWaehlen(s)} aria-pressed={start === s} data-testid={`termin-zeit-${s}`}>
                {zeit(s)}
              </button>
            ))}
          </div>
        )}
      </div>
      <p className="tb-zone">{K.terminZone}</p>
    </div>
  );
}
