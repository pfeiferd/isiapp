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
| `muenzen.html`| Spielleiter-Tool: Team-Münzen zum Ausschneiden               |
| `karte.html`  | Übersicht aller Teamrouten auf echten Fußwegen               |
| `eltern.html` | Handy-Check für die Eltern – Link vorab verschicken          |
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
   - Ist die Dose nach der eigenen Münze **leer**, war das Team das letzte hier –
     dann nimmt es die leere Dose mit (siehe unten).
5. Jedes Team läuft dieselben 8 Stationen in **anderer Reihenfolge** –
   so laufen die Teams nicht nebeneinander her.
6. Nach der letzten Station geht es zurück zum **Basislager (Im Jockele 13)** –
   erst dort stoppt die Uhr.
7. Ergebnis: Bruttozeit − 4 min pro Goldmünze − 2 min pro leerer Dose −
   Routen-Ausgleich = **Endzeit**. Das Team mit der kleinsten Endzeit gewinnt.

## Vorbereitung (Checkliste)

### 1. Koordinaten setzen (WICHTIG!)

Die Koordinaten in `config.js` wurden am **27.09.2026 vor Ort erfasst** und
sind einsatzbereit. Wenn sich ein Versteck ändert, gibt es zwei Wege:

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
`cache`-Text) verstecken. Jedes Team hat sein eigenes Münzdesign (siehe
`muenzen.html` zum Ausdrucken) – so lässt sich nicht schummeln, wer welche
Münze schon eingesammelt hat.

**In jede Dose kommt genau EINE Münze pro mitspielendem Team.** Damit ist die
Dose exakt dann leer, wenn das letzte Team seine Münze genommen hat – dieses
Team nimmt die Dose mit und bekommt dafür **2 min Zeitgutschrift**
(`boxBonusSeconds`). Das hilft langsamen Teams beim Aufholen, ohne dass
Trödeln rentabel wird: Ein Platz weiter hinten an einer Station kostet rund
25 Minuten echte Zeit und bringt nur 2 Minuten zurück.

> ⚠️ **Wenn T5 „Die Falken" nicht mitspielt, dürfen die T5-Münzen nicht in die
> Dosen** – sonst wird keine Dose je leer und der Bonus läuft ins Leere.

Nebeneffekt: Die Dosen kommen von selbst wieder im Basislager an. Nicht alle –
findet ein Team seine Dose nicht, bleibt sie draußen liegen und muss
eingesammelt werden. Am Ende abgleichen, welche Stationen fehlen.

Zurückgebrachte Dosen **müssen leer sein**. Ist noch eine Münze drin, hat das
Team die Dose zu früh eingesteckt.

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

Die `offsetSeconds` in `config.js` sind bereits aus den **echten Fußwegen**
gerechnet (Valhalla-Routing, Stand 27.09.2026): kürzeste Route = 0 s, jedes
andere Team bekommt seinen Mehrweg bei ~4 km/h Kindertempo gutgeschrieben.
`karte.html` zeigt Route, Länge und Ausgleich pro Team.

Wenn du Stationen oder Routen änderst, musst du das neu rechnen. `setup.html`
zeigt unterwegs nur die **Luftlinie** – als grober Richtwert: 60 s pro ~80 m
Mehrweg, ab ~150 m Unterschied lohnt sich der Ausgleich.

### 6. Eltern den Handy-Check schicken

Ein paar Tage vorher den Link zu `eltern.html` an die Eltern schicken
(`https://…github.io/isiapp/eltern.html`). Die Seite prüft auf dem Handy des
Kindes: sichere Verbindung, Speicher, GPS-Freigabe samt Genauigkeit, Kompass
(inkl. iOS-Rückfrage „Bewegung & Ausrichtung") und Bildschirm-Wachhalten.
Dazu die Punkte, die nur die Eltern einstellen können: Akku, Energiesparmodus,
Bildschirmsperre, genauer Standort.

Wichtig ist vor allem der **Kompass-Test**: Ohne nordbezogenen Sensor dreht
sich die Nadel zwar, zeigt aber nicht nach Norden – das merkt man sonst erst
im Gelände. Die Seite hat dafür einen „Ergebnis kopieren"-Knopf, damit Eltern
dir Probleme vorab schicken können.

### 7. Generalprobe

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
`setup.html` erreichst du unter `…/isiapp/setup.html`. Den **Handy-Check für
die Eltern** verschickst du als `…/isiapp/eltern.html` – das ist der einzige
Link, den Außenstehende vorab bekommen.

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
- Spieldauer: 8 Stationen ≈ 4,4–5,0 km Fußweg ≈ 2 Stunden inkl. Rätseln.
- Bei Regen: Dosen wasserdicht, Handys in Gefrierbeutel 😄
