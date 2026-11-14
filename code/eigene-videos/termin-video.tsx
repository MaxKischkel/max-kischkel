import { useEffect, useRef, useState } from 'react';
import { Play, Video as VideoIcon } from 'lucide-react';
import { terminSeite as T, type Video } from '@/content/termin-seite';

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
          poster={video.bild ?? undefined}
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
    <div className={`lv lv-cover${gross ? ' lv-gross' : ''}${video.bild ? ' lv-mit-bild' : ''}`} data-testid={`video-${id}`}>
      {video.bild && <img src={video.bild} alt="" className="lv-bild" loading="lazy" decoding="async" width={1280} height={720} />}
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
