import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react';
import { Link } from 'wouter';
import { Check, Loader2, Mail, Phone } from 'lucide-react';
import { ANFRAGE_RATE_ERROR, ANFRAGE_SEND_ERROR, anfrageSchema } from '@workspace/api-zod/anfrage';
import { Signet } from './logo';
import { Reveal } from './reveal';
import { MediaPlaceholder, TextPlaceholder } from './placeholders';
import { TerminBuchung, useTerminStatus } from './termin';
import { CalendlyEinbettung } from './calendly-einbettung';
import { calendlyLink } from '@/lib/consent';
import { BRAND, kontaktContent as K, placeholders } from '@/content/site';

type FieldKey = 'name' | 'unternehmen' | 'email' | 'telefon' | 'nachricht';
type Values = Record<FieldKey, string>;
type Errors = Partial<Record<FieldKey, string>>;
const ORDER: FieldKey[] = ['name', 'unternehmen', 'email', 'telefon', 'nachricht'];
const MIN_SHOWN_MS = 2500;
const EMPTY: Values = { name: '', unternehmen: '', email: '', telefon: '', nachricht: '' };

function validate(v: Values, website: string, shownAt: number): { errors: Errors; payload: Record<string, unknown> } {
  const payload: Record<string, unknown> = { name: v.name, unternehmen: v.unternehmen, email: v.email, angezeigtAm: shownAt };
  if (v.telefon.trim()) payload.telefon = v.telefon;
  if (v.nachricht.trim()) payload.nachricht = v.nachricht;
  if (website) payload.website = website;
  const res = anfrageSchema.safeParse(payload);
  const errors: Errors = {};
  if (!res.success) {
    for (const issue of res.error.issues) {
      const k = issue.path[0] as FieldKey;
      if (ORDER.includes(k) && !errors[k]) errors[k] = issue.message;
    }
  }
  return { errors, payload };
}

export function Kontakt() {
  const terminStatus = useTerminStatus();
  const kalender = terminStatus?.aktiv ? terminStatus : null;
  // Ohne Calendly-Token: kostenloser Calendly-Kalender per Link aus site.ts
  const einbettung = terminStatus && !kalender ? calendlyLink() : null;
  const terminReiter = !!kalender || !!einbettung;
  const [reiter, setReiter] = useState<'termin' | 'nachricht'>('nachricht');
  const reiterGewaehlt = useRef(false);
  const reiterRefs = useRef<Record<'termin' | 'nachricht', HTMLButtonElement | null>>({ termin: null, nachricht: null });
  const reiterTaste = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const next = e.key === 'Home' ? 'termin' : e.key === 'End' ? 'nachricht' : reiter === 'termin' ? 'nachricht' : 'termin';
    reiterGewaehlt.current = true;
    setReiter(next);
    reiterRefs.current[next]?.focus();
  };
  const [values, setValues] = useState<Values>(EMPTY);
  useEffect(() => {
    if (terminReiter && !reiterGewaehlt.current && Object.values(values).every((v) => !v)) setReiter('termin');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terminReiter]);
  const [errors, setErrors] = useState<Errors>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [alertMsg, setAlertMsg] = useState('');
  const [alertTick, setAlertTick] = useState(0);
  const [focusTick, setFocusTick] = useState(0);
  const sendingRef = useRef(false);
  const shownAt = useRef(Date.now());
  const honeypot = useRef<HTMLInputElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstInvalid = useRef<FieldKey | null>(null);

  // Move focus to the heading when the section is targeted by its anchor.
  useEffect(() => {
    const go = () => {
      if (window.location.hash === '#kontakt') headingRef.current?.focus({ preventScroll: true });
    };
    let frame = 0;
    const click = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href]');
      if (link?.hash === '#kontakt' && link.pathname === window.location.pathname) {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(go);
      }
    };
    go();
    window.addEventListener('hashchange', go);
    document.addEventListener('click', click);
    return () => {
      window.removeEventListener('hashchange', go);
      document.removeEventListener('click', click);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (status === 'error') alertRef.current?.focus();
    if (status === 'success') successRef.current?.focus();
  }, [status, alertTick]);

  useEffect(() => {
    const k = firstInvalid.current;
    if (k) document.getElementById(`kf-${k}`)?.focus();
  }, [focusTick]);

  const onChange = (k: FieldKey) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...values, [k]: e.target.value };
    setValues(next);
    if (attempted) setErrors(validate(next, '', shownAt.current).errors);
  };

  const showFieldErrors = (errs: Errors) => {
    setErrors(errs);
    firstInvalid.current = ORDER.find((k) => errs[k]) ?? null;
    setFocusTick((t) => t + 1);
  };
  const fail = (msg: string) => {
    setAlertMsg(msg);
    setStatus('error');
    setAlertTick((t) => t + 1);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (sendingRef.current) return;
    setAttempted(true);
    const website = honeypot.current?.value ?? '';
    const { errors: errs, payload } = validate(values, website, shownAt.current);
    if (Object.keys(errs).length) {
      showFieldErrors(errs);
      return;
    }
    sendingRef.current = true;
    setStatus('sending');
    setAlertMsg('');
    try {
      const wait = shownAt.current + MIN_SHOWN_MS - Date.now();
      if (wait > 0) await new Promise((r) => setTimeout(r, wait + 50));
      const res = await fetch('/api/anfragen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      let body: { gespeichert?: boolean; message?: string; fieldErrors?: Record<string, string | string[]> } | null = null;
      try { body = await res.json(); } catch { body = null; }
      if (res.status === 201 && body?.gespeichert === true) {
        setStatus('success');
        return;
      }
      if (res.status === 429) { fail(ANFRAGE_RATE_ERROR); return; }
      if (body?.fieldErrors && typeof body.fieldErrors === 'object') {
        const mapped: Errors = {};
        for (const k of ORDER) {
          const m = body.fieldErrors[k];
          const msg = Array.isArray(m) ? m[0] : m;
          if (typeof msg === 'string' && msg) mapped[k] = msg;
        }
        if (Object.keys(mapped).length) {
          setStatus('idle');
          setAttempted(true);
          showFieldErrors(mapped);
          return;
        }
      }
      fail(ANFRAGE_SEND_ERROR);
    } catch {
      fail(ANFRAGE_SEND_ERROR);
    } finally {
      sendingRef.current = false;
    }
  };

  const sending = status === 'sending';
  const field = (k: FieldKey, label: string, required: boolean, props: Record<string, string>, area = false) => {
    const err = errors[k];
    const common = {
      id: `kf-${k}`,
      name: k,
      value: values[k],
      onChange: onChange(k),
      className: 'kinput',
      'aria-invalid': err ? true : undefined,
      'aria-describedby': err ? `kf-${k}-err` : area ? `kf-${k}-count` : undefined,
      'aria-required': required || undefined,
      'data-testid': `input-${k}`,
      ...props,
    };
    return (
      <div className="kfield">
        <label htmlFor={`kf-${k}`} className="klabel">
          {label}
          {required ? <span className="kstar" aria-hidden="true"> *</span> : <span className="font-normal"> (optional)</span>}
        </label>
        {area ? <textarea rows={5} {...common} /> : <input {...common} />}
        {err && <p id={`kf-${k}-err`} className="kerr">{err}</p>}
        {area && (
          <p id={`kf-${k}-count`} className="kcount" data-over={values[k].length > 2000} aria-live="off">
            {values[k].length} / 2000
          </p>
        )}
      </div>
    );
  };

  const p = placeholders.ansprechpartner;
  const tel = p.telefon?.trim();
  const mail = p.email?.trim();
  const role = p.rolle?.trim();
  const name = p.name?.trim();

  return (
    <section id="kontakt" className="section relative bg-kontakt on-dark" data-testid="section-kontakt">
      <Signet className="absolute top-8 right-5 md:right-8" />
      <div className="wrap">
        <Reveal>
          <p className="kicker">{K.kicker}</p>
          <h2 className="h2" tabIndex={-1} ref={headingRef}>
            <span className="block">{K.strong}</span>
            <span className="block font-normal text-espresso-100">{K.regular}</span>
          </h2>
        </Reveal>
        <div className="kgrid">
          <Reveal delay={80} className="kform-card">
            {terminReiter && (
              <>
                <div className="ktabs" role="tablist" aria-label={K.tabsLabel}>
                  {(['termin', 'nachricht'] as const).map((r) => (
                    <button
                      key={r}
                      ref={(el) => { reiterRefs.current[r] = el; }}
                      type="button"
                      role="tab"
                      id={`ktab-${r}`}
                      className="ktab"
                      aria-selected={reiter === r}
                      aria-controls={`kpanel-${r}`}
                      tabIndex={reiter === r ? 0 : -1}
                      onClick={() => { reiterGewaehlt.current = true; setReiter(r); }}
                      onKeyDown={reiterTaste}
                      data-testid={`tab-kontakt-${r}`}
                    >
                      {r === 'termin' ? K.tabTermin : K.tabNachricht}
                    </button>
                  ))}
                </div>
                <div role="tabpanel" id="kpanel-termin" aria-labelledby="ktab-termin" hidden={reiter !== 'termin'}>
                  {kalender ? <TerminBuchung status={kalender} /> : einbettung ? <CalendlyEinbettung link={einbettung} /> : null}
                </div>
              </>
            )}
            <div {...(terminReiter ? { role: 'tabpanel', id: 'kpanel-nachricht', 'aria-labelledby': 'ktab-nachricht', hidden: reiter !== 'nachricht' } : {})}>
            {status === 'success' ? (
              <div className="ksuccess" role="status" tabIndex={-1} ref={successRef} data-testid="status-anfrage-success">
                <div className="ksuccess-icon" aria-hidden="true"><Check size={32} /></div>
                <p>{K.success}</p>
              </div>
            ) : (
              <form noValidate onSubmit={onSubmit} aria-busy={sending} data-testid="form-anfrage">
                {status === 'error' && (
                  <div className="kalert" role="alert" tabIndex={-1} ref={alertRef} data-testid="alert-anfrage-error">
                    {alertMsg}
                  </div>
                )}
                <p className="mb-5 text-[15px]">{K.required}</p>
                <div className="kgrid2">
                  {field('name', 'Name', true, { type: 'text', autoComplete: 'name' })}
                  {field('unternehmen', 'Unternehmen', true, { type: 'text', autoComplete: 'organization' })}
                </div>
                <div className="kgrid2">
                  {field('email', 'Geschäftliche E-Mail-Adresse', true, { type: 'email', autoComplete: 'email', inputMode: 'email' })}
                  {field('telefon', 'Telefonnummer', false, { type: 'tel', autoComplete: 'tel', inputMode: 'tel' })}
                </div>
                {field('nachricht', K.nachrichtLabel, false, { autoComplete: 'off' }, true)}
                <div className="khp" aria-hidden="true">
                  <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
                </div>
                <button type="submit" className="btn btn-primary kbtn" disabled={sending} data-testid="button-anfrage-senden">
                  {sending ? (<><Loader2 size={20} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />{K.sending}</>) : K.submit}
                </button>
                <p className="kpriv">
                  {K.privacyPre}
                  <Link href="/datenschutz" data-testid="link-form-datenschutz">{K.privacyLink}</Link>.
                </p>
              </form>
            )}
            </div>
          </Reveal>
          <Reveal delay={160} as="aside" className="kperson">
            {p.bild ? (
              <img src={p.bild} alt={p.bildAlt ?? ''} className="aspect-[4/5] w-full rounded-[20px] object-cover object-top" width={900} height={1125} loading="lazy" decoding="async" />
            ) : (
              <MediaPlaceholder motif={K.personMotif} className="aspect-[4/5] w-full" />
            )}
            <p className="kperson-name" data-testid="text-ansprechpartner-name">
              {name ? name : <TextPlaceholder>{K.labels.name}</TextPlaceholder>}
            </p>
            <p>
              {role ? role : <TextPlaceholder>{K.labels.rolle}</TextPlaceholder>}, {BRAND.name}
            </p>
            <div className="kperson-row">
              <Phone size={20} aria-hidden="true" />
              {tel ? (
                <a className="klink" href={`tel:${tel.startsWith('0') ? `+49${tel.slice(1).replace(/\D/g, '')}` : tel.replace(/[^\d+]/g, '')}`}>{tel}</a>
              ) : (
                <TextPlaceholder>{K.labels.telefon}</TextPlaceholder>
              )}
            </div>
            <div className="kperson-row">
              <Mail size={20} aria-hidden="true" />
              {mail ? (
                <a className="klink" href={`mailto:${mail}`}>{mail}</a>
              ) : (
                <TextPlaceholder>{K.labels.email}</TextPlaceholder>
              )}
            </div>
            <p className="kperson-note">{K.personNote}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
