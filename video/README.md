# Kischkel Personal – Erklärvideo

**Fertiges Video:** `Kischkel_Personal_Erklaervideo.mp4` (1920×1080, 30 fps, ca. 1:58 min, Stimme: Killian, Tempo +22 %, mit Sprecher, Untertiteln und Musik)

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
python3 tts.py de-DE-KillianNeural "<Text>" vo/s1.mp3 +22%
python3 build_timeline.py                    # Timing aus den Wort-Zeitmarken
python3 mix.py                               # Musik + Stimme -> mix.wav
node render.js 0 <frames> out.mp4            # Bilder rendern (Playwright + ffmpeg)
```
Die Animationen hängen an den gesprochenen Wörtern (`data-in="@Wort"` in `index.html`).
Wird der Text geändert, passt sich das Timing automatisch an.
