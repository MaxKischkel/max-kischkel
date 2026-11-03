import { LegalLink, LegalPage, LegalSection } from '@/components/site/legal-page';

export default function Impressum() {
  return (
    <LegalPage path="/impressum" title="Impressum">
      <LegalSection heading="Angaben gemäß § 5 DDG">
        <p>
          Max Kischkel<br />
          Kischkel Personal (Einzelunternehmen)<br />
          Marc-Chagall-Straße 122<br />
          40477 Düsseldorf
        </p>
      </LegalSection>
      <LegalSection heading="Kontakt">
        <p>
          Telefon: <LegalLink href="tel:+491751141087">+49 175 1141087</LegalLink>
          <br />
          E-Mail: <LegalLink href="mailto:info@kischkel-personal.de">info@kischkel-personal.de</LegalLink>
        </p>
      </LegalSection>
      <LegalSection heading="Wirtschafts-Identifikationsnummer">
        <p>Wirtschafts-Identifikationsnummer gemäß § 139c AO: DE461824125-00001</p>
      </LegalSection>
      <LegalSection heading="Inhaltlich verantwortlich">
        <p>
          Max Kischkel<br />
          Marc-Chagall-Straße 122<br />
          40477 Düsseldorf
        </p>
      </LegalSection>
      <LegalSection heading="Verbraucherstreitbeilegung">
        <p>
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </LegalSection>
      <LegalSection heading="Haftung für Inhalte und Links">
        <p>
          Wir erstellen die Inhalte dieser Website mit großer Sorgfalt, können für Richtigkeit, Vollständigkeit und Aktualität aber keine Gewähr übernehmen. Für Inhalte externer Websites, auf die wir verlinken, sind ausschließlich deren Betreiber verantwortlich. Werden uns Rechtsverletzungen bekannt, entfernen wir die betreffenden Inhalte oder Links umgehend.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
