# Kischkel Personal – Erklärvideo

**Fertiges Video:** `Kischkel_Personal_Erklaervideo.mp4` (1920×1080, 30 fps, ca. 2:05 min, Stimme: Brian (Multilingual), Tempo +22 %, mit Sprecher, Untertiteln und Musik)

## Aufbau
1. Stellenanzeige ohne Rücklauf
2. Der Arbeitsmarkt hat sich gewandelt
3. Agentur: viel versprochen (Social Ads), wenig geliefert
4. Kontrollverlust: Wissen, Prozesse, Arbeitgebermarke gehen nach außen
5. Recruiting gehört ins eigene Haus (unter 2 Std. pro Woche)
6. Kischkel Personal, Max Kischkel, 100+ Zusammenarbeiten
7. Das Kischkel-Personal-Konzept in drei Schritten
8. Zwei Pakete: 360° Recruiting System und Arbeitgeber-DNA
9. Ergebnisse aus der Praxis
10. BAFA-Förderung (50–80 %, Eigenanteil ab 700 €)
11. Abschluss mit Kontakt und Endkarte

## Neu erzeugen
```bash
pip install edge-tts                         # Sprecherstimme
# Sprechertext in script.json ändern, dann pro Szene:
python3 tts.py en-US-BrianMultilingualNeural "<Text>" vo/s1.mp3 +22%
python3 build_timeline.py                    # Timing aus den Wort-Zeitmarken
python3 mix.py                               # Musik + Stimme -> mix.wav
node render.js 0 <frames> out.mp4            # Bilder rendern (Playwright + ffmpeg)
```
Die Animationen hängen an den gesprochenen Wörtern (`data-in="@Wort"` in `index.html`).
Wird der Text geändert, passt sich das Timing automatisch an.

## Aussprache
Englische Begriffe stehen in `script.json` in deutscher Lautschrift, damit Brian sie deutsch ausspricht:
„Rekruuting“ (Recruiting), „Onbording“ (Onboarding), „Baafa“ (BAFA).
Social Ads und Social Media werden auf Deutsch umschrieben („Werbung in sozialen Netzwerken“, „Auftritt in den sozialen Medien“), Benefits als „Zusatzleistungen“.
In den Untertiteln erscheint automatisch die richtige Schreibweise (Tabelle `DISPLAY` in `index.html`).

## Sprach-Check
`python3 langcheck.py vo small` (braucht `pip install faster-whisper`) prüft jeden Satz der Sprecherspur
und markiert Stellen, die eher englisch als deutsch klingen. Kurze Ein-Wort-Sätze („Zweitens:“) und reine
Aufzählungen kippen bei Brian leicht ins Englische, deshalb stehen sie als ganze deutsche Sätze im Skript.
