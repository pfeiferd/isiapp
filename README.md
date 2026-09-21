# 🗺️ Schatzsuche im Ziegeleipark

Eine GPS-basierte Schnitzeljagd (Geocaching-Stil) für Kindergeburtstage –
komplett statisch (HTML/CSS/JavaScript), läuft im Browser jedes modernen
Smartphones. Keine Server, keine App-Installation.

**Geschichte:** Der alte Ziegelmeister Jakob Brandner hat vor über 100 Jahren
seinen Goldschatz im Ziegeleipark versteckt. Die Teams folgen seiner Rätselspur.

## Dateien

| Datei         | Zweck                                                        |
|---------------|--------------------------------------------------------------|
| `index.html`  | Die Spiel-App für die Kinder                                 |
| `config.js`   | **Alles Anpassbare**: Geschichte, Stationen, Rätsel, Teams   |
| `setup.html`  | Spielleiter-Tool: Koordinaten vor Ort erfassen, Routen prüfen|
| `qrcodes.html`| Spielleiter-Tool: QR-Code pro Team zum Ausdrucken            |
| `style.css`   | Schatzkarten-Design                                          |
| `app.js`      | Spiellogik                                                   |

## So läuft das Spiel ab

1. Jedes Team (3–5 Teams) bekommt ein Smartphone und sein eigenes **QR-Code-Blatt**
   (aus `qrcodes.html`, siehe Vorbereitung).
2. QR-Code scannen → die App öffnet sich direkt im richtigen Team → Geschichte +
   Regeln lesen → **Start** drücken (die Uhr läuft ab jetzt!).
3. Kompasspfeil + Meteranzeige führen zur nächsten Station. Erst im Zielradius
   (Standard 25 m) wird „Wir sind da!" freigeschaltet.
4. An der Station: ggf. Hinweis auf das **echte Versteck** (Dose mit Goldmünzen –
   jedes Team nimmt genau EINE) und immer ein **Rätsel mit Zahlenantwort**.
   - Falsche Antwort → **2 Minuten Zeitstrafe** (Wartebildschirm mit Tipp).
   - Nach 3 Fehlversuchen wird die Lösung gezeigt und es geht weiter.
5. Jedes Team läuft dieselben 8 Stationen in **anderer Reihenfolge** –
   so laufen die Teams nicht nebeneinander her.
6. Nach der letzten Station geht es zurück zum **Basislager (Im Jockele 13)** –
   erst dort stoppt die Uhr.
7. Ergebnis: Bruttozeit − 4 min pro Goldmünze − Routen-Ausgleich = **Endzeit**.
   Das Team mit der kleinsten Endzeit gewinnt.

## Vorbereitung (Checkliste)

### 1. Koordinaten setzen (WICHTIG!)

Die Koordinaten in `config.js` sind **Platzhalter**. Zwei Wege:

- **Vor Ort (empfohlen):** `setup.html` auf dem Handy öffnen, zu jedem
  Versteck laufen, „📍 Hier setzen" drücken. Am Ende die exportierten Werte in
  `config.js` eintragen. (Die erfassten Punkte bleiben im Handy gespeichert,
  bis du sie überträgst.)
- **Am Schreibtisch:** In Google Maps Rechtsklick auf den Punkt →
  „Koordinaten kopieren" → in `config.js` bei `lat`/`lon` eintragen.

### 2. Stationen & Rätsel anpassen

In `config.js`: Namen, Wegbeschreibungen (`hint`), Versteck-Anweisungen
(`cache`) und Rätsel (`riddle`) frei ändern. Antworten sind immer Zahlen.
Stationen kannst du löschen oder hinzufügen – die Team-Routen (`route`)
entsprechend anpassen.

### 3. Caches verstecken

Kleine wasserdichte Dosen/Beutel mit „Goldmünzen" an allen 8 Stationen (siehe
`cache`-Text) verstecken. Genug Münzen für alle Teams einlegen! Jedes Team
hat sein eigenes Münzdesign (siehe `muenzen.html` zum Ausdrucken) – so lässt
sich nicht schummeln, wer welche Münze schon eingesammelt hat.

### 4. QR-Codes für die Teams drucken

`qrcodes.html` öffnen (am besten schon auf der veröffentlichten Seite, siehe
unten) → oben steht die Adresse der Spiel-App, ggf. die öffentliche
`https://…github.io/…`-Adresse eintragen → **drucken** → an der gestrichelten
Linie auseinanderschneiden. Jedes Blatt enthält den QR-Code eines Teams.

Wer scannt, landet direkt im richtigen Team (`?team=T1` in der URL) – ohne
Teamwahl und ohne Code-Eingabe. Der 4-stellige Team-Code aus `config.js` bleibt
als Rückfalloption erhalten: Wenn ein Scan mal nicht klappt, kann man die App
ganz normal öffnen, das Team antippen und den Code eingeben (er steht klein auf
dem QR-Blatt).

### 5. Routenlängen prüfen

`setup.html` zeigt unten die Luftlinien-Länge jeder Team-Route. Bei deutlichen
Unterschieden (> 150 m) beim benachteiligten Team `offsetSeconds` in
`config.js` erhöhen (Richtwert: 60 s pro ~80 m Luftlinie).

### 6. Generalprobe

Auf dem Mac/PC: `index.html` öffnen und mit **Testmodus** durchspielen –
entweder URL mit `?test=1` aufrufen oder im Spiel **7× auf die Uhr tippen**
(Spielleiter-Menü) und Testmodus einschalten. Dann erscheint ein Button
„Ankunft simulieren", der GPS ersetzt.

## Veröffentlichen (GitHub Pages)

GPS im Browser funktioniert **nur über HTTPS** – GitHub Pages liefert das:

```bash
git init && git add . && git commit -m "Schatzsuche"
gh repo create isiapp --public --source=. --push
gh api repos/{owner}/isiapp/pages -f "source[branch]=main" -f "source[path]=/"
```

Danach ist die App unter `https://<benutzer>.github.io/isiapp/` erreichbar.
Die QR-Codes für die Teams erzeugst du unter `…/isiapp/qrcodes.html`,
`setup.html` erreichst du unter `…/isiapp/setup.html`.

> Tipp: Repo erst kurz vor dem Fest veröffentlichen oder die Antworten
> ändern – die Lösungen stehen ja in `config.js` 😉. Für 10–12-Jährige im
> Gelände ist das aber praktisch kein Risiko.

## Während des Spiels (Spielleiter)

- **Spielleiter-Menü:** 7× schnell auf die Zeitanzeige tippen →
  Station überspringen, Testmodus, Spiel zurücksetzen.
- **GM-Code `7913`** als Rätsel-Antwort eingeben = Station ohne Strafe
  überspringen (z. B. wenn GPS an einer Stelle zickt).
- **Handy für ein anderes Team umwidmen:** einfach den QR-Code des neuen Teams
  scannen – vor dem Überschreiben eines laufenden Spielstands fragt die App nach.
- Der Spielstand übersteht Seiten-Reloads und Browser-Abstürze (localStorage).
- Handys: Bildschirmsperre auf „nie", Energiesparmodus aus, Standort „immer
  erlauben", vorher einmal die Seite laden (dann ist sie im Cache).

## Sicherheit & Praxis

- Pro Team eine erwachsene Begleitperson oder klare Reviergrenzen vereinbaren.
- Notfall-Handynummer des Spielleiters auf jedes Handy/Team-Zettel.
- Spieldauer: 8 Stationen ≈ 4–5 km ≈ 2 Stunden inkl. Rätseln.
- Bei Regen: Dosen wasserdicht, Handys in Gefrierbeutel 😄
