import { useMemo, useState } from 'react';
import { Play, Video as VideoIcon } from 'lucide-react';
import { useConsent } from './consent-context';
import { terminSeite as T, type Video } from '@/content/termin-seite';

/** Loom-Link (share oder embed) in die Einbettungs-Adresse umwandeln. */
export function loomEmbed(link: string | null): string | null {
  if (!link) return null;
  try {
    const url = new URL(link);
    if (url.protocol !== 'https:' || !/(^|\.)loom\.com$/.test(url.hostname)) return null;
    const id = url.pathname.match(/\/(?:share|embed)\/([a-f0-9]{16,64})/i)?.[1];
    return id ? `https://www.loom.com/embed/${id}?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true` : null;
  } catch {
    return null;
  }
}

/**
 * Loom-Video im Kischkel-Design. Lädt erst nach Einwilligung "Externe Inhalte"
 * oder nach Klick auf Abspielen (der Klick gilt für diesen Besuch).
 */
export function LoomVideo({ video, gross = false, id }: { video: Video; gross?: boolean; id: string }) {
  const { choice, save } = useConsent();
  const [geklickt, setGeklickt] = useState(false);
  const src = useMemo(() => loomEmbed(video.loom), [video.loom]);
  const erlaubt = !!choice?.extern || geklickt;

  if (!src) {
    return (
      <div className={`lv lv-leer${gross ? ' lv-gross' : ''}`} data-testid={`video-${id}`}>
        <span className="lv-leer-icon" aria-hidden="true"><VideoIcon size={gross ? 32 : 24} /></span>
        <span className="lv-leer-text">{T.video.folgt}</span>
      </div>
    );
  }

  if (erlaubt) {
    return (
      <div className={`lv${gross ? ' lv-gross' : ''}`} data-testid={`video-${id}`}>
        <iframe
          src={`${src}${geklickt ? '&autoplay=1' : ''}`}
          title={video.titel}
          className="lv-frame"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          data-testid={`video-frame-${id}`}
        />
      </div>
    );
  }

  const abspielen = () => {
    if (choice) save({ statistik: choice.statistik, marketing: choice.marketing, extern: true });
    setGeklickt(true);
  };

  return (
    <div className={`lv lv-cover${gross ? ' lv-gross' : ''}${video.bild ? ' lv-mit-bild' : ''}`} data-testid={`video-${id}`}>
      {video.bild && <img src={video.bild} alt="" className="lv-bild" loading="lazy" decoding="async" width={1024} height={576} />}
      <button type="button" className="lv-start" onClick={abspielen} data-testid={`video-start-${id}`}>
        <span className="lv-play" aria-hidden="true"><Play size={gross ? 26 : 20} fill="currentColor" /></span>
        <span className="lv-start-text">
          <strong>{T.video.laden}</strong>
          <span className="sr-only-x">: {video.titel}</span>
          {video.dauer && <small>{video.dauer}</small>}
        </span>
      </button>
      {gross && <p className="lv-hinweis">{T.video.hinweis}</p>}
    </div>
  );
}
