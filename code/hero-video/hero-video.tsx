import { useEffect, useRef, useState } from 'react';
import { heroContent } from '@/content/site';
import './hero-video.css';

/**
 * Erklärvideo im Hero. Bis zum Klick wird nur das Vorschaubild geladen,
 * das Video selbst erst beim Abspielen (preload="none").
 */
export function HeroVideo() {
  const v = heroContent.video;
  const videoRef = useRef<HTMLVideoElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [gestartet, setGestartet] = useState(false);
  const ersterLauf = useRef(true);

  const abspielen = () => {
    const el = videoRef.current;
    if (!el) return;
    setGestartet(true);
    // play() direkt im Klick aufrufen, damit Browser den Ton erlauben
    void el.play().catch(() => setGestartet(false));
  };

  useEffect(() => {
    if (ersterLauf.current) { ersterLauf.current = false; return; }
    if (gestartet) videoRef.current?.focus({ preventScroll: true });
    else buttonRef.current?.focus({ preventScroll: true });
  }, [gestartet]);

  return (
    <figure className="hero-videoframe" data-testid="hero-video">
      <video
        ref={videoRef}
        className="hv-video"
        src={v.src}
        poster={v.poster}
        preload="none"
        playsInline
        controls={gestartet}
        aria-label={v.titel}
        onEnded={() => setGestartet(false)}
        data-testid="video-hero"
      />
      {!gestartet && (
        <button ref={buttonRef} type="button" className="hv-start" onClick={abspielen} aria-label={`${v.playLabel}, Dauer ${v.dauer}, mit Ton`} data-testid="button-hero-video">
          <img src={v.cover} alt="" width={1280} height={720} loading="eager" fetchPriority="high" decoding="async" className="hv-cover" />
          <span className="hv-copy" aria-hidden="true">
            <span className="hv-kicker">
              <span className="hv-kicker-lang">{v.kicker}</span>
              <span className="hv-kicker-kurz">{v.kickerKurz}</span>
            </span>
            <span className="hv-title">
              <span>{v.zeile1}</span>
              <span>{v.zeile2}</span>
            </span>
            <span className="hv-cta">
              <span className="hv-play">
                <svg viewBox="0 0 24 24" focusable="false"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" fill="currentColor" /></svg>
              </span>
              <span className="hv-cta-text">
                <strong>{v.button}</strong>
                <small>{v.buttonHinweis}</small>
              </span>
            </span>
          </span>
        </button>
      )}
    </figure>
  );
}
