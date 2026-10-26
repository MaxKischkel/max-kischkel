import { LegalLink, LegalPage, LegalSection, Placeholder } from '@/components/site/legal-page';
import { CookieSettingsButton } from '@/components/site/consent-context';

export default function Datenschutz() {
  return (
    <LegalPage path="/datenschutz" title="Datenschutzerklärung">
      <LegalSection number={1} heading="Verantwortlicher">
        <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>
        <p>
          Max Kischkel, Kischkel Personal<br />
          Marc-Chagall-Straße 122, 40477 Düsseldorf<br />
          Telefon: <LegalLink href="tel:+491751141087">+49 175 1141087</LegalLink><br />
          E-Mail: <LegalLink href="mailto:info@kischkel-personal.de">info@kischkel-personal.de</LegalLink>
        </p>
      </LegalSection>
      <LegalSection number={2} heading="Allgemeines zur Datenverarbeitung">
        <p>Wir verarbeiten personenbezogene Daten nur, soweit dies für eine funktionsfähige Website, unsere Inhalte und Leistungen erforderlich ist oder Sie eingewilligt haben. Rechtsgrundlagen sind insbesondere Art. 6 Abs. 1 lit. a DSGVO (Einwilligung), lit. b (Vertrag oder vorvertragliche Maßnahmen) und lit. f (berechtigtes Interesse). Die Speicherung von Informationen auf Ihrem Endgerät oder der Zugriff darauf erfolgt, sofern nicht technisch erforderlich, nur mit Ihrer Einwilligung nach § 25 Abs. 1 TDDDG.</p>
        <p>Daten werden gelöscht, sobald der Zweck der Speicherung entfällt und keine gesetzlichen Aufbewahrungspflichten (z. B. nach Handels- und Steuerrecht) entgegenstehen.</p>
      </LegalSection>
      <LegalSection number={3} heading="Hosting">
        <p>Diese Website wird bei Replit, Inc., 1001 E Hillsdale Blvd, Suite 400, Foster City, CA 94404, USA gehostet. Beim Aufruf der Website werden automatisch Informationen in Server-Logfiles erfasst, die Ihr Browser übermittelt: IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Seite, Referrer-URL, Browsertyp und Betriebssystem. Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse liegt in der sicheren und stabilen Bereitstellung der Website.</p>
        <p>Da Replit seinen Sitz in den USA hat, können Daten in die USA übermittelt werden. Die Übermittlung stützt sich auf <Placeholder>EU-US Data Privacy Framework oder EU-Standardvertragsklauseln, bitte prüfen</Placeholder>. Mit Replit besteht ein Vertrag zur Auftragsverarbeitung nach Art. 28 DSGVO <Placeholder>bitte abschließen</Placeholder>.</p>
      </LegalSection>
      <LegalSection number={4} heading="SSL- bzw. TLS-Verschlüsselung">
        <p>Diese Website nutzt aus Sicherheitsgründen eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie an „https://“ in der Adresszeile Ihres Browsers.</p>
      </LegalSection>
      <LegalSection number={5} heading="Kontaktformular und Anfragen per E-Mail oder Telefon">
        <p>Wenn Sie uns über das Kontaktformular, per E-Mail oder telefonisch kontaktieren, verarbeiten wir Ihre Angaben (Name, Unternehmen, E-Mail-Adresse, optional Telefonnummer und Nachricht), um Ihre Anfrage zu bearbeiten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage auf einen Vertrag abzielt, im Übrigen Art. 6 Abs. 1 lit. f DSGVO. Die Daten löschen wir, sobald die Anfrage abschließend bearbeitet ist und keine Aufbewahrungspflichten bestehen.</p>
        <p>Zur Verwaltung von Anfragen nutzen wir <Placeholder>Name und Anschrift des Tools, z. B. CRM, wird ergänzt</Placeholder>.</p>
      </LegalSection>
      <LegalSection number={6} heading="Einwilligungsverwaltung (Cookie-Banner)">
        <p>Wir nutzen eine eigene Einwilligungsverwaltung dieser Website ohne externen Anbieter; Ihre Auswahl wird in Ihrem Browser (Local Storage) gespeichert, um Ihre Einwilligung in die Speicherung von Cookies und den Einsatz von Analyse- und Marketing-Diensten einzuholen und zu dokumentieren. Rechtsgrundlage ist Art. 6 Abs. 1 lit. c DSGVO in Verbindung mit Art. 7 Abs. 1 DSGVO. Sie können Ihre Einwilligung jederzeit über <CookieSettingsButton className="text-orange-700 underline underline-offset-4" /> mit Wirkung für die Zukunft widerrufen.</p>
      </LegalSection>
      <LegalSection number={7} heading="Google Analytics">
        <p>Mit Ihrer Einwilligung nutzen wir Google Analytics 4, einen Webanalysedienst der Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Google Analytics erfasst Informationen über Ihre Nutzung der Website (z. B. aufgerufene Seiten, Verweildauer, Geräte- und Browserdaten) und setzt dazu Cookies. IP-Adressen werden in der EU gekürzt. Eine Übermittlung in die USA ist möglich; Google ist unter dem EU-US Data Privacy Framework zertifiziert.</p>
        <p>Rechtsgrundlage ist Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG. Mehr erfahren Sie unter <LegalLink href="https://policies.google.com/privacy">https://policies.google.com/privacy</LegalLink>.</p>
      </LegalSection>
      <LegalSection number={8} heading="Meta-Pixel">
        <p>Mit Ihrer Einwilligung nutzen wir das Meta-Pixel der Meta Platforms Ireland Limited, Merrion Road, Dublin 4, D04 X2K5, Irland. Damit können wir messen, wie wirksam unsere Anzeigen auf Facebook und Instagram sind, und Anzeigen gezielt an Besucher dieser Website ausspielen. Dabei werden Daten an Meta übermittelt und können dort Ihrem Nutzerkonto zugeordnet werden. Eine Übermittlung in die USA ist möglich; Meta ist unter dem EU-US Data Privacy Framework zertifiziert.</p>
        <p>Für die Erhebung und Übermittlung der Daten sind wir mit Meta gemeinsam verantwortlich (Art. 26 DSGVO); die Vereinbarung finden Sie unter <LegalLink href="https://www.facebook.com/legal/controller_addendum">https://www.facebook.com/legal/controller_addendum</LegalLink>. Rechtsgrundlage ist Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG. Mehr erfahren Sie unter <LegalLink href="https://www.facebook.com/privacy/policy">https://www.facebook.com/privacy/policy</LegalLink>.</p>
      </LegalSection>
      <LegalSection number={9} heading="Terminbuchung mit Calendly">
        <p>Für die Buchung von Gesprächsterminen nutzen wir Calendly, einen Dienst der Calendly LLC, 115 E Main St, Ste A1B, Buford, GA 30518, USA.</p>
        <p>Im Kontaktbereich können Sie Termine in einem eingebetteten Kalender von Calendly buchen. Der Kalender wird erst geladen, wenn Sie in den Cookie-Einstellungen „Externe Inhalte“ erlauben oder auf „Kalender anzeigen“ klicken. Dann stellt Ihr Browser eine Verbindung zu Calendly her. Calendly erhält dabei insbesondere Ihre IP-Adresse, Angaben zu Ihrem Browser und die Adresse dieser Seite und kann Cookies oder ähnliche Technologien einsetzen. Rechtsgrundlage ist Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG. Sie können sie jederzeit über die Cookie-Einstellungen im Footer widerrufen. Wenn Sie einen Termin buchen, verarbeitet Calendly Ihre Angaben (etwa Name, E-Mail-Adresse, gewählter Termin und Ihre Antworten im Buchungsformular), legt den Termin an und sendet Ihnen eine Bestätigung per E-Mail. Rechtsgrundlage dafür ist Art. 6 Abs. 1 lit. b DSGVO.</p>
        <p>Stellen wir die Terminauswahl stattdessen in unserem eigenen Design dar, gilt: Die freien Termine ruft unser Server bei Calendly ab, dabei werden keine Daten von Ihnen an Calendly übertragen. Erst wenn Sie einen Termin verbindlich buchen, übermittelt unser Server Ihre Angaben (Name, Unternehmen, E-Mail-Adresse, gewählter Termin, Zeitzone, optional Telefonnummer und Nachricht) an Calendly. Calendly legt den Termin an, speichert die Angaben und sendet Ihnen eine Bestätigung per E-Mail. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO.</p>
        <p>Calendly ist unter dem EU-US Data Privacy Framework zertifiziert <Placeholder>bitte prüfen</Placeholder>. Mit Calendly besteht ein Vertrag zur Auftragsverarbeitung. Mehr erfahren Sie unter <LegalLink href="https://calendly.com/privacy">https://calendly.com/privacy</LegalLink>.</p>
      </LegalSection>
      <LegalSection number={10} heading="LinkedIn">
        <p>Auf dieser Website verlinken wir auf unser Profil bei LinkedIn. Es handelt sich um einen einfachen Link; beim Besuch unserer Website werden keine Daten an LinkedIn übertragen. Erst wenn Sie den Link anklicken, gelten die Datenschutzbestimmungen von LinkedIn: <LegalLink href="https://www.linkedin.com/legal/privacy-policy">https://www.linkedin.com/legal/privacy-policy</LegalLink>.</p>
      </LegalSection>
      <LegalSection number={11} heading="Schriftarten">
        <p>Die auf dieser Website verwendeten Schriftarten sind lokal eingebunden. Beim Aufruf der Seite wird keine Verbindung zu Servern von Google oder anderen Drittanbietern hergestellt.</p>
      </LegalSection>
      <LegalSection number={12} heading="Ihre Rechte">
        <p>Sie haben jederzeit das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) sowie auf Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO). Wenden Sie sich dazu an die oben genannte Kontaktadresse.</p>
        <p><strong>Widerspruchsrecht:</strong> Beruht eine Verarbeitung auf Art. 6 Abs. 1 lit. f DSGVO, können Sie aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit widersprechen (Art. 21 DSGVO).</p>
        <p><strong>Beschwerderecht:</strong> Sie können sich bei einer Datenschutz-Aufsichtsbehörde beschweren. Zuständig für uns ist die Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen, Kavalleriestraße 2-4, 40213 Düsseldorf.</p>
      </LegalSection>
      <LegalSection number={13} heading="Aktualität">
        <p>Stand dieser Datenschutzerklärung: Oktober 2026. Wir passen sie an, wenn sich unsere Website oder die Rechtslage ändert.</p>
      </LegalSection>
    </LegalPage>
  );
}
