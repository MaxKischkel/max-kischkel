import { useEffect, useRef, useState } from 'react';
import { Play, Video as VideoIcon } from 'lucide-react';
import { LogoMark } from './logo';
import { terminSeite as T, type Folie, type Video } from '@/content/termin-seite';

/** Nachbau der ersten Videofolie als Vorschau (ohne Kamerabild). */
function FolieVorschau({ f }: { f: Folie }) {
  return (
    <div className="lv-folie" aria-hidden="true">
      <svg className="lv-folie-linien" viewBox="0 0 160 90" preserveAspectRatio="none">
        <path d="M92 -4 C 96 30, 110 62, 152 96" />
        <path d="M101 -4 C 108 34, 124 62, 166 86" />
        <path d="M60 -4 C 62 20, 70 40, 86 52" />
      </svg>
      <div className="lv-folie-kopf">
        <span className="lv-folie-logo"><LogoMark className="lv-folie-zeichen" /><span><b>Kischkel</b><br />Personal</span></span>
        {f.oben && <span className="lv-folie-oben">{f.oben}</span>}
      </div>
      <div className="lv-folie-box">
        {f.kicker && <p className="lv-folie-kicker">{f.kicker}</p>}
        <p className="lv-folie-titel">{f.titel}</p>
        {f.text && <p className="lv-folie-text">{f.text}</p>}
      </div>
    </div>
  );
}

/**
 * Video direkt von dieser Website (ohne Loom oder andere Anbieter).
 * Vor dem Abspielen: Standbild mit leuchtendem Button. Das Video lädt erst beim Klick.
 */
export function TerminVideo({ video, gross = false, id }: { video: Video; gross?: boolean; id: string }) {
  const [laeuft, setLaeuft] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!laeuft) return;
    const v = ref.current;
    if (!v) return;
    v.focus({ preventScroll: true });
    void v.play().catch(() => { /* Browser blockiert Autoplay: Steuerung ist sichtbar */ });
  }, [laeuft]);

  if (!video.datei) {
    return (
      <div className={`lv lv-leer${gross ? ' lv-gross' : ''}`} data-testid={`video-${id}`}>
        <span className="lv-leer-icon" aria-hidden="true"><VideoIcon size={gross ? 32 : 24} /></span>
        <span className="lv-leer-text">{T.video.folgt}</span>
      </div>
    );
  }

  if (laeuft) {
    return (
      <div className={`lv${gross ? ' lv-gross' : ''}`} data-testid={`video-${id}`}>
        <video
          ref={ref}
          className="lv-frame"
          src={video.datei}
          controls
          playsInline
          preload="auto"
          controlsList="nodownload"
          aria-label={video.titel}
          data-testid={`video-player-${id}`}
          onEnded={() => setLaeuft(false)}
        />
      </div>
    );
  }

  return (
    <div className={`lv lv-cover${gross ? ' lv-gross' : ''}${video.folie ? ' lv-mit-bild' : ''}`} data-testid={`video-${id}`}>
      {video.folie && <FolieVorschau f={video.folie} />}
      <button type="button" className="lv-start" onClick={() => setLaeuft(true)} data-testid={`video-start-${id}`}>
        <span className="lv-play" aria-hidden="true"><Play size={gross ? 26 : 20} fill="currentColor" /></span>
        <span className="lv-start-text">
          <strong>{T.video.laden}</strong>
          <span className="sr-only-x">: {video.titel}</span>
          {video.dauer && <small>{video.dauer}</small>}
        </span>
      </button>
    </div>
  );
}
