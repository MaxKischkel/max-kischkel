import { useEffect } from 'react';
import { useDocMeta } from '@/components/site/use-doc-meta';
import { HOME_DESCRIPTION, HOME_TITLE } from '@/lib/page-meta';
import { Hero } from '@/components/site/hero';
import { Problem } from '@/components/site/problem';
import { System } from '@/components/site/system';
import { Challenges } from '@/components/site/challenges';
import { CtaBand } from '@/components/site/cta-band';
import { Metrics } from '@/components/site/metrics';
import { TeamSection } from '@/components/site/team-section';
import { Einsatzgebiet } from '@/components/site/einsatzgebiet';
import { Cases } from '@/components/site/cases';
import { Ablauf } from '@/components/site/ablauf';
import { FaqSection } from '@/components/site/faq';
import { Kontakt } from '@/components/site/kontakt';

export default function Home() {
  useDocMeta(HOME_TITLE, HOME_DESCRIPTION, true);
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    let cancelled = false;
    void document.fonts.ready.then(() => {
      if (!cancelled) document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    return () => { cancelled = true; };
  }, []);
  return (
    <>
      <Hero />
      <Problem />
      <System />
      <Challenges />
      <CtaBand />
      <Metrics />
      <TeamSection />
      <Einsatzgebiet />
      <Cases />
      <Ablauf />
      <FaqSection />
      <Kontakt />
    </>
  );
}
