import { LegalLink, LegalPage, LegalSection } from '@/components/site/legal-page';
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
        <p>Verantwortlicher ist die Person, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung personenbezogener Daten entscheidet.</p>
      </LegalSection>
      <LegalSection number={2} heading="Allgemeines zur Datenverarbeitung">
        <p>Wir verarbeiten personenbezogene Daten nur, soweit dies für eine funktionsfähige Website, unsere Inhalte und Leistungen erforderlich ist oder Sie eingewilligt haben. Rechtsgrundlagen sind insbesondere Art. 6 Abs. 1 lit. a DSGVO (Einwilligung), lit. b (Vertrag oder vorvertragliche Maßnahmen), lit. c (rechtliche Verpflichtung) und lit. f (berechtigtes Interesse). Die Speicherung von Informationen auf Ihrem Endgerät oder der Zugriff darauf erfolgt, sofern nicht technisch erforderlich, nur mit Ihrer Einwilligung nach § 25 Abs. 1 TDDDG.</p>
        <p><strong>Speicherdauer:</strong> Soweit in dieser Erklärung keine speziellere Frist genannt ist, löschen wir Ihre Daten, sobald der Zweck der Verarbeitung entfällt, Sie Ihre Einwilligung widerrufen oder der Verarbeitung berechtigt widersprechen. Gesetzliche Aufbewahrungspflichten, etwa nach Handels- und Steuerrecht (in der Regel sechs bzw. acht Jahre), bleiben unberührt.</p>
        <p><strong>Dienstleister:</strong> Für Hosting, E-Mail, Kundenverwaltung, Videokonferenzen, Videos und Terminbuchung setzen wir Dienstleister ein, die Daten in unserem Auftrag und nach unseren Weisungen verarbeiten (Art. 28 DSGVO).</p>
        <p><strong>Übermittlung in Drittländer:</strong> Einige dieser Dienstleister haben ihren Sitz in den USA oder verarbeiten Daten dort. Eine Übermittlung erfolgt nur, wenn ein angemessenes Datenschutzniveau besteht. Grundlage ist der Angemessenheitsbeschluss der EU-Kommission zum EU-US Data Privacy Framework (Art. 45 DSGVO), soweit der Anbieter dort zertifiziert ist, im Übrigen die Standardvertragsklauseln der EU-Kommission (Art. 46 Abs. 2 lit. c DSGVO).</p>
      </LegalSection>
      <LegalSection number={3} heading="Hosting">
        <p>Diese Website wird bei Replit, Inc., 1001 E Hillsdale Blvd, Suite 400, Foster City, CA 94404, USA gehostet. Beim Aufruf der Website werden automatisch Informationen in Server-Logfiles erfasst, die Ihr Browser übermittelt: IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Seite, Referrer-URL, Browsertyp und Betriebssystem. Auch die Angaben aus dem Kontaktformular werden in einer Datenbank bei Replit gespeichert.</p>
        <p>Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse liegt in der sicheren und stabilen Bereitstellung der Website. Zur Übermittlung in die USA siehe Abschnitt 2.</p>
      </LegalSection>
      <LegalSection number={4} heading="SSL- bzw. TLS-Verschlüsselung">
        <p>Diese Website nutzt aus Sicherheitsgründen eine SSL- bzw. TLS-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie an „https://“ in der Adresszeile Ihres Browsers.</p>
      </LegalSection>
      <LegalSection number={5} heading="Kontaktformular und Anfragen per E-Mail oder Telefon">
        <p>Wenn Sie uns über das Kontaktformular, per E-Mail oder telefonisch kontaktieren, verarbeiten wir Ihre Angaben (Name, Unternehmen, E-Mail-Adresse, optional Telefonnummer und Nachricht), um Ihre Anfrage zu bearbeiten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage auf einen Vertrag abzielt, im Übrigen Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse liegt in der Beantwortung Ihrer Anfrage. Ihre Daten geben wir nicht ohne Ihre Einwilligung an Dritte weiter, abgesehen von den hier genannten Dienstleistern.</p>
        <p>Die Daten löschen wir, sobald die Anfrage abschließend bearbeitet ist und keine Aufbewahrungspflichten bestehen.</p>
      </LegalSection>
      <LegalSection number={6} heading="E-Mail mit Google Workspace">
        <p>Für unsere E-Mail-Kommunikation (etwa info@kischkel-personal.de) und die Benachrichtigung über neue Anfragen aus dem Kontaktformular nutzen wir Google Workspace der Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Dabei werden die Inhalte Ihrer Nachrichten sowie Ihre Kontaktdaten auf Servern von Google gespeichert. Eine Übermittlung in die USA ist möglich; Google ist unter dem EU-US Data Privacy Framework zertifiziert.</p>
        <p>Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit es um Vertragsanbahnung oder Vertragserfüllung geht, im Übrigen Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse liegt in einer zuverlässigen und sicheren Kommunikation. Mehr erfahren Sie unter <LegalLink href="https://policies.google.com/privacy">https://policies.google.com/privacy</LegalLink>.</p>
      </LegalSection>
      <LegalSection number={7} heading="Kundenverwaltung mit Close">
        <p>Zur Verwaltung von Anfragen, Kontakten und Kundenbeziehungen nutzen wir das CRM-System Close der Close.com, Inc., San Francisco, USA. Dort speichern wir die Angaben aus Ihrer Anfrage, unsere Kommunikation mit Ihnen und Notizen zu Gesprächen. Zur Übermittlung in die USA siehe Abschnitt 2.</p>
        <p>Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit es um Vertragsanbahnung oder Vertragserfüllung geht, im Übrigen Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse liegt in einer geordneten und effizienten Kundenbetreuung. Mehr erfahren Sie unter <LegalLink href="https://www.close.com/privacy">https://www.close.com/privacy</LegalLink>.</p>
      </LegalSection>
      <LegalSection number={8} heading="Terminbuchung mit Calendly">
        <p>Für die Buchung von Gesprächsterminen nutzen wir Calendly, einen Dienst der Calendly LLC, 115 E Main St, Ste A1B, Buford, GA 30518, USA.</p>
        <p>Im Kontaktbereich können Sie Termine in einem eingebetteten Kalender von Calendly buchen. Der Kalender wird erst geladen, wenn Sie in den Cookie-Einstellungen „Externe Inhalte“ erlauben oder auf „Kalender anzeigen“ klicken. Dann stellt Ihr Browser eine Verbindung zu Calendly her. Calendly erhält dabei insbesondere Ihre IP-Adresse, Angaben zu Ihrem Browser und die Adresse dieser Seite und kann Cookies oder ähnliche Technologien einsetzen. Rechtsgrundlage ist Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG. Sie können sie jederzeit über die Cookie-Einstellungen im Footer widerrufen.</p>
        <p>Wenn Sie einen Termin buchen, verarbeitet Calendly Ihre Angaben (etwa Name, E-Mail-Adresse, gewählter Termin und Ihre Antworten im Buchungsformular), legt den Termin an und sendet Ihnen eine Bestätigung per E-Mail. Die Termindaten nutzen wir zur Planung, Durchführung und Nachbereitung des Gesprächs. Rechtsgrundlage dafür ist Art. 6 Abs. 1 lit. b DSGVO.</p>
        <p>Stellen wir die Terminauswahl stattdessen in unserem eigenen Design dar, gilt: Die freien Termine ruft unser Server bei Calendly ab, dabei werden keine Daten von Ihnen an Calendly übertragen. Erst wenn Sie einen Termin verbindlich buchen, übermittelt unser Server Ihre Angaben (Name, Unternehmen, E-Mail-Adresse, gewählter Termin, Zeitzone, optional Telefonnummer und Nachricht) an Calendly.</p>
        <p>Zur Übermittlung in die USA siehe Abschnitt 2. Mehr erfahren Sie unter <LegalLink href="https://calendly.com/privacy">https://calendly.com/privacy</LegalLink>.</p>
      </LegalSection>
      <LegalSection number={9} heading="Videos von Loom">
        <p>Auf einzelnen Seiten, etwa nach einer Terminbuchung, binden wir Videos des Dienstes Loom ein (Loom, Inc., ein Unternehmen der Atlassian-Gruppe, San Francisco, USA). Die Videos werden erst geladen, wenn Sie in den Cookie-Einstellungen „Externe Inhalte“ erlauben oder auf „Video abspielen“ klicken. Dann stellt Ihr Browser eine Verbindung zu Loom her. Loom erhält dabei insbesondere Ihre IP-Adresse, Angaben zu Ihrem Browser und die Adresse dieser Seite und kann Cookies oder ähnliche Technologien einsetzen, etwa um Wiedergaben zu zählen.</p>
        <p>Rechtsgrundlage ist Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG. Sie können sie jederzeit über die Cookie-Einstellungen im Footer widerrufen. Zur Übermittlung in die USA siehe Abschnitt 2. Mehr erfahren Sie unter <LegalLink href="https://www.atlassian.com/legal/privacy-policy">https://www.atlassian.com/legal/privacy-policy</LegalLink>.</p>
      </LegalSection>
      <LegalSection number={10} heading="Videokonferenzen mit Google Meet und Zoom">
        <p>Für Gespräche mit Interessenten und Kunden nutzen wir Google Meet (Teil von Google Workspace, Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland) und Zoom (Zoom Communications, Inc., 55 Almaden Boulevard, 6th Floor, San Jose, CA 95113, USA).</p>
        <p>Dabei werden die Daten verarbeitet, die Sie bei der Teilnahme angeben (etwa Name und E-Mail-Adresse), außerdem Metadaten wie Beginn, Ende und Dauer der Konferenz sowie technische Daten wie IP-Adresse, Geräte- und Browserinformationen. Bild und Ton werden nur übertragen, wenn Sie Kamera und Mikrofon freigeben. Wir zeichnen Gespräche nicht ohne Ihre ausdrückliche Zustimmung auf.</p>
        <p>Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit es um Vertragsanbahnung oder Vertragserfüllung geht, im Übrigen Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse liegt in einer einfachen und schnellen Kommunikation. Zur Übermittlung in die USA siehe Abschnitt 2. Mehr erfahren Sie unter <LegalLink href="https://policies.google.com/privacy">https://policies.google.com/privacy</LegalLink> und <LegalLink href="https://www.zoom.com/de/trust/privacy/">https://www.zoom.com/de/trust/privacy/</LegalLink>.</p>
      </LegalSection>
      <LegalSection number={11} heading="Einwilligungsverwaltung (Cookie-Banner)">
        <p>Wir nutzen eine eigene Einwilligungsverwaltung dieser Website ohne externen Anbieter; Ihre Auswahl wird in Ihrem Browser (Local Storage) gespeichert, um Ihre Einwilligung in die Speicherung von Cookies und den Einsatz von Analyse-, Marketing- und externen Diensten einzuholen und zu dokumentieren. Rechtsgrundlage ist Art. 6 Abs. 1 lit. c DSGVO in Verbindung mit Art. 7 Abs. 1 DSGVO. Sie können Ihre Einwilligung jederzeit über <CookieSettingsButton className="text-orange-700 underline underline-offset-4" /> mit Wirkung für die Zukunft widerrufen. Die Rechtmäßigkeit der bis dahin erfolgten Verarbeitung bleibt davon unberührt.</p>
      </LegalSection>
      <LegalSection number={12} heading="Google Analytics">
        <p>Mit Ihrer Einwilligung nutzen wir Google Analytics 4, einen Webanalysedienst der Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Google Analytics erfasst Informationen über Ihre Nutzung der Website (z. B. aufgerufene Seiten, Verweildauer, Geräte- und Browserdaten) und setzt dazu Cookies. IP-Adressen werden in der EU gekürzt. Google-Signale und personalisierte Werbung sind deaktiviert. Eine Übermittlung in die USA ist möglich; Google ist unter dem EU-US Data Privacy Framework zertifiziert.</p>
        <p>Rechtsgrundlage ist Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG. Mehr erfahren Sie unter <LegalLink href="https://policies.google.com/privacy">https://policies.google.com/privacy</LegalLink>.</p>
      </LegalSection>
      <LegalSection number={13} heading="Meta-Pixel">
        <p>Mit Ihrer Einwilligung nutzen wir das Meta-Pixel der Meta Platforms Ireland Limited, Merrion Road, Dublin 4, D04 X2K5, Irland. Damit können wir messen, wie wirksam unsere Anzeigen auf Facebook und Instagram sind, und Anzeigen gezielt an Besucher dieser Website ausspielen. Dabei werden Daten an Meta übermittelt und können dort Ihrem Nutzerkonto zugeordnet werden. Eine Übermittlung in die USA ist möglich; Meta ist unter dem EU-US Data Privacy Framework zertifiziert.</p>
        <p>Für die Erhebung und Übermittlung der Daten sind wir mit Meta gemeinsam verantwortlich (Art. 26 DSGVO); die Vereinbarung finden Sie unter <LegalLink href="https://www.facebook.com/legal/controller_addendum">https://www.facebook.com/legal/controller_addendum</LegalLink>. Rechtsgrundlage ist Ihre Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG. Mehr erfahren Sie unter <LegalLink href="https://www.facebook.com/privacy/policy">https://www.facebook.com/privacy/policy</LegalLink>.</p>
      </LegalSection>
      <LegalSection number={14} heading="Bewerbungen">
        <p>Wenn Sie sich bei uns bewerben (z. B. per E-Mail, postalisch oder über ein Bewerbungsformular), verarbeiten wir Ihre Angaben und Unterlagen (etwa Kontaktdaten, Lebenslauf, Zeugnisse und Notizen aus Gesprächen), soweit dies für die Entscheidung über ein Beschäftigungsverhältnis erforderlich ist. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO in Verbindung mit § 26 BDSG sowie, sofern Sie eingewilligt haben, Art. 6 Abs. 1 lit. a DSGVO. Ihre Daten erhalten nur Personen, die an der Bearbeitung Ihrer Bewerbung beteiligt sind.</p>
        <p>Kommt kein Beschäftigungsverhältnis zustande, löschen wir Ihre Daten spätestens sechs Monate nach Abschluss des Verfahrens, sofern Sie nicht in eine längere Speicherung eingewilligt haben. Die Aufbewahrung bis dahin dient der Abwehr möglicher Rechtsansprüche (Art. 6 Abs. 1 lit. f DSGVO). Bei erfolgreicher Bewerbung übernehmen wir die Daten in die Personalakte.</p>
      </LegalSection>
      <LegalSection number={15} heading="Schriftarten">
        <p>Die auf dieser Website verwendeten Schriftarten sind lokal eingebunden. Beim Aufruf der Seite wird keine Verbindung zu Servern von Google oder anderen Drittanbietern hergestellt.</p>
      </LegalSection>
      <LegalSection number={16} heading="Ihre Rechte">
        <p>Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten Daten, deren Herkunft, Empfänger und Zweck (Art. 15 DSGVO), auf Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18) und Datenübertragbarkeit (Art. 20) sowie auf Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO). Wenden Sie sich dazu an die oben genannte Kontaktadresse.</p>
        <p><strong>Widerspruchsrecht:</strong> Beruht eine Verarbeitung auf Art. 6 Abs. 1 lit. f DSGVO, können Sie aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit widersprechen (Art. 21 Abs. 1 DSGVO). Wir verarbeiten Ihre Daten dann nicht mehr, es sei denn, wir können zwingende schutzwürdige Gründe nachweisen oder die Verarbeitung dient der Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen. Der Verarbeitung zu Zwecken der Direktwerbung können Sie jederzeit ohne Angabe von Gründen widersprechen (Art. 21 Abs. 2 DSGVO).</p>
        <p><strong>Beschwerderecht:</strong> Sie können sich bei einer Datenschutz-Aufsichtsbehörde beschweren (Art. 77 DSGVO). Zuständig für uns ist die Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen, Kavalleriestraße 2-4, 40213 Düsseldorf.</p>
      </LegalSection>
      <LegalSection number={17} heading="Aktualität">
        <p>Stand dieser Datenschutzerklärung: November 2026. Wir passen sie an, wenn sich unsere Website, unsere Dienste oder die Rechtslage ändern.</p>
      </LegalSection>
    </LegalPage>
  );
}
