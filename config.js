// ============================================================
//  KONFIGURATION – Schatzsuche im Ziegeleipark
//  Diese Datei ist die EINZIGE, die du anpassen musst.
//
//  Alle Koordinaten wurden am 27.09.2026 VOR ORT mit setup.html
//  erfasst (GPS am Versteck) und sind damit die verbindlichen
//  Spielkoordinaten. Die Routenlängen und karte.html sind auf
//  diesen Stand neu gerechnet.
// ============================================================

const CONFIG = {

  // ---------- Allgemeine Spieleinstellungen ----------
  settings: {
    arrivalRadius: 25,      // Meter: so nah muss man ran, bis "Wir sind da!" freigeschaltet wird
    penaltySeconds: 120,    // Zeitstrafe (Wartezeit) pro falscher Antwort
    maxAttempts: 3,         // nach so vielen Fehlversuchen geht es ohne Lösung weiter
    coinBonusSeconds: 240,  // jede gesammelte Münze zählt so viele Sekunden Zeitgutschrift
    boxBonusSeconds: 120,   // jede mitgebrachte LEERE Dose zählt so viele Sekunden Zeitgutschrift.
                            // Bewusst halb so viel wie eine Münze: Wer an einer Station letztes
                            // Team ist, findet die Dose leer und nimmt sie mit. Das hilft langsamen
                            // Teams beim Aufholen, ohne dass absichtliches Trödeln rentabel wird
                            // (ein Platz später an einer Station kostet ~25 min, bringt aber nur 2).
    gmCode: "7913",         // Spielleiter-Code: als Antwort eingegeben => Station wird übersprungen
  },

  // ---------- Die Geschichte ----------
  story: {
    title: "Der Schatz des alten Ziegelmeisters",
    teaser: "Ein über 100 Jahre altes Geheimnis wartet im Ziegeleipark …",
    text: `Vor über 100 Jahren stand hier, wo heute der Ziegeleipark liegt, eine große
Ziegelei. Tag und Nacht rauchten die Öfen, und der Ziegelmeister Jakob Brandner
brannte die besten Ziegel weit und breit.

Als die Ziegelei schließen musste, wollte Jakob seinen Lohn – eine Kiste voller
Goldmünzen – nicht der Bank anvertrauen. Er versteckte den Schatz irgendwo auf
dem Gelände und hinterließ eine Spur aus kniffligen Rätseln. Nur wer alle
Stationen findet und die Rätsel löst, kommt dem Schatz näher.

Zwei geheimnisvolle Wahrzeichen wachen bis heute über Jakobs Schatz: eine
mächtige Säule aus Stein, die den Himmel zu tragen scheint – und ein leuchtend
rotes Tor. Man sagt: Wer hindurchschaut, blickt zurück in die Zeit der
Ziegelei …

Seitdem haben es viele versucht. Keiner hat es geschafft. Heute seid IHR dran!

Euer Handy zeigt euch, in welche Richtung ihr laufen müsst und wie weit es noch
ist. An jeder Station wartet ein Rätsel – und manchmal ein echtes Versteck mit
Goldmünzen. Aber Vorsicht: Wer falsch antwortet, verliert wertvolle Zeit!`,
    rules: [
      "Bleibt immer als Team zusammen – das Handy trägt abwechselnd jemand anderes.",
      "Die Nadel zeigt Norden, das 🎯-Zielsymbol und die Meterzahl führen euch zur nächsten Station.",
      "Erst wenn ihr nah genug seid, könnt ihr »Wir sind da!« drücken.",
      "Antworten sind immer ZAHLEN. Falsche Antwort = Zeitstrafe (warten!).",
      "An jeder Station liegen Goldmünzen versteckt: Nehmt genau EINE pro Team und lasst den Rest liegen!",
      "Ist die Dose nach eurer Münze LEER? Dann wart ihr das letzte Team hier – nehmt die leere Dose mit!",
      "Jede Münze und jede mitgebrachte Dose bringt am Ende Zeitgutschrift. Das schnellste Team (nach Gutschrift) gewinnt.",
      "Achtet auf Wege, Radfahrer und andere Parkbesucher!",
    ],
  },

  // ---------- Start & Ziel (Basislager) ----------
  start: {
    name: "Basislager – Im Jockele 13",
    lat: 49.130135,         // vor Ort erfasst 27.09.2026
    lon: 9.187214,
    radius: 30,
    finishText: "Lauft zurück zum Basislager! Dort endet eure Schatzsuche – die Zeit läuft, bis ihr ankommt!",
  },

  // ---------- Die Stationen ----------
  // "hint"  = Wegbeschreibung/Ortsbeschreibung, wird beim Navigieren angezeigt
  // "cache" = Anweisung zum echten Versteck (leer lassen, wenn es keins gibt)
  // "riddle.answer" = immer eine Zahl (als String)
  waypoints: [
    {
      id: "W1",
      name: "Das alte Ziegelei-Tor",
      hint: "Ihr seid richtig, wo man Jakobs Reich betritt und eine Tafel die Besucher grüßt.",
      lat: 49.131738, lon: 9.183736, radius: 25,   // vor Ort erfasst 27.09.2026
      cache: "Jakobs Dose liegt in der Däumlingshöhle. EINE Münze nehmen, Dose genau so zurücklegen!",
      riddle: {
        text: "Jakobs Ringofen hatte 14 Kammern. In jeder Kammer wurden genau 250 Ziegel gebrannt. Wie viele Ziegel waren das bei einem Brand insgesamt?",
        answer: "3500",
        tip: "14 × 250 – rechnet in Ruhe, sonst gibt's eine Zeitstrafe!",
      },
    },
    {
      id: "W2",
      name: "Der Wolkenspiegel",
      hint: "Sucht den Ort, an dem sich der Himmel spiegelt und gefiederte Wächter schwimmen.",
      lat: 49.133223, lon: 9.180682, radius: 25,   // vor Ort erfasst 27.09.2026
      cache: "Am Ufer wartet die rettende Hilfe – dort ist Jakobs Dose versteckt. Nehmt EINE Goldmünze für euer Team und legt die Dose genau so zurück!",
      riddle: {
        text: "Auf dem See schwimmen 5 Entenfamilien. Jede Mutter hat 6 Küken dabei. Wie viele Enten schwimmen insgesamt auf dem See (Mütter mitzählen)?",
        answer: "35",
        tip: "5 Mütter + 5 × 6 Küken.",
      },
    },
    {
      id: "W3",
      name: "Der Hexentreff",
      hint: "Hier oben, so raunt man, trafen sich nachts die Hexen und blickten weit über Jakobs Reich. Ihr seid richtig, wenn auch ihr weit ins Land schauen könnt.",
      lat: 49.131884, lon: 9.176261, radius: 30,   // vor Ort erfasst 27.09.2026
      cache: "Der Hexen-Schatz liegt bei den Stufen des Walpurgisplatzes. EINE Münze nehmen, Dose genau so zurücklegen!",
      riddle: {
        text: "In der Vollmondnacht treffen sich hier 3 Hexen zum Tanz – und jede bringt 2 Schwestern mit. Dann kommt noch der Kater der ältesten Hexe dazu und tanzt mit! Wie viele tanzen im Hexenkreis?",
        answer: "10",
        tip: "3 Hexen + ihre Schwestern (3 × 2) + 1 Kater.",
      },
    },
    {
      id: "W4",
      name: "Der Tummelplatz",
      hint: "Wo früher Jakobs Arbeiter rasteten, wird heute getobt und geklettert.",
      lat: 49.134630, lon: 9.180469, radius: 25,   // vor Ort erfasst 27.09.2026
      cache: "Jakobs Dose liegt am höchsten Punkt des Tummelplatzes. EINE Münze nehmen, Dose genau so zurücklegen!",
      riddle: {
        text: "Ich bin eine geheime Zahl. Verdoppelt man mich und zählt dann 8 dazu, kommt 30 heraus. Welche Zahl bin ich?",
        answer: "11",
        tip: "Rechnet rückwärts: erst 8 abziehen, dann halbieren.",
      },
    },
    {
      id: "W5",
      name: "Die alte Lehmgrube",
      hint: "Unter dieser Wiese schlummert die Grube, aus der Jakob einst seinen Lehm holte.",
      lat: 49.131943, lon: 9.177911, radius: 30,   // vor Ort erfasst 27.09.2026
      cache: "Jakobs Lehm-Schatz steckt im Felsenspalt. EINE Münze nehmen, Dose genau so zurücklegen!",
      riddle: {
        text: "Jakob schaffte jeden Tag doppelt so viele Karren Lehm aus der Grube wie am Tag davor: Am 1. Tag 2 Karren, am 2. Tag 4, dann 8, dann 16 … Wie viele Karren waren es am 5. Tag?",
        answer: "32",
        tip: "Jeden Tag wird die Zahl verdoppelt.",
      },
    },
    {
      id: "W6",
      name: "Das Rote Tor der Zeit",
      hint: "Sucht Jakobs Tor der Zeit! Ihr erkennt es erst, wenn ihr fast davor steht. Dann: hindurchschauen!",
      lat: 49.133606, lon: 9.174536, radius: 25,   // vor Ort erfasst 27.09.2026
      cache: "Jakobs Dose liegt an der hölzernen Ruhestätte. EINE Münze nehmen, Dose genau so zurücklegen!",
      riddle: {
        text: "Wer durch das Rote Tor der Zeit schaut, blickt genau 111 Jahre zurück – bis in die Tage der alten Ziegelei! Wir haben das Jahr 2026. Welches Jahr seht ihr durch das Tor?",
        answer: "1915",
        tip: "2026 minus 111 – schriftlich rechnen hilft!",
      },
    },
    {
      id: "W7",
      name: "Die Säule des Himmels",
      hint: "Jakobs steinerner Wächter trägt hier den Himmel. Erst ganz nah verrät er euch sein Geheimnis.",
      lat: 49.133242, lon: 9.185432, radius: 30,   // vor Ort erfasst 27.09.2026
      cache: "Jakobs Dose liegt am Tor zur Erhebung. EINE Münze nehmen, Dose genau so zurücklegen!",
      riddle: {
        // Die Jahrestafel hängt über dem "Tor zur Erhebung" (vor Ort bestätigt
        // 27.09.2026). Die Jahreszahl 1929 stammt aus Wikipedia – beim Verstecken
        // der Dose einmal ablesen und hier ggf. korrigieren.
        text: "Die Säule des Himmels verrät ihr Alter nur dem, der genau hinschaut: Sucht an ihr die Jahreszahl ihrer Erbauung und gebt sie als Code ein!",
        answer: "1929",
        tip: "Sucht das Tor zur Erhebung – und schaut darüber!",
      },
    },
    {
      id: "W8",
      name: "Jakobs Gebote",
      hint: "Im äußersten Winkel von Jakobs Reich, wo der Weg sich um die Gärten schmiegt, steht geschrieben, was hier erlaubt ist und was nicht.",
      lat: 49.134670, lon: 9.181937, radius: 25,   // vor Ort erfasst 27.09.2026
      cache: "Bei der Tafel mit den Geboten steckt eine gut getarnte Dose. EINE Münze nehmen und Dose genau so zurücklegen!",
      riddle: {
        text: "Jakob schrieb seinen Ziegelbrennern 10 Gebote auf eine Tafel. Jeder seiner 4 Lehrjungen musste jedes Gebot zweimal abschreiben. Wie viele Zeilen schrieben die Lehrjungen zusammen?",
        answer: "80",
        tip: "10 Gebote × 4 Lehrjungen × 2 Mal abschreiben.",
      },
    },
  ],

  // ---------- Teams & Routen ----------
  // Jedes Team besucht ALLE Stationen, aber in anderer Reihenfolge,
  // damit die Teams nicht nebeneinander herlaufen.
  // "offsetSeconds": Zeit-Ausgleich für längere Routen (positiv = Gutschrift,
  //                  wird am Ende abgezogen). Berechnet aus dem echten Fußweg
  //                  (Valhalla-Routing, Stand 27.09.2026) gegen die kürzeste
  //                  Route (4,41 km) bei ~4 km/h Kindertempo.
  // "code": 4-stelliger Team-Code – nur noch Rückfalloption. Normalerweise
  //         scannt das Team seinen QR-Code (qrcodes.html), der die App mit
  //         ?team=T1 öffnet; dann entfallen Teamwahl und Code-Eingabe.
  // Gruppenzuordnung der Kinder erfolgt per Würfeln zu Spielbeginn.
  // T5 "Die Falken" ist das Reserve-Team, nur bei Bedarf (z. B. genug Kinder
  // für ein 5. Team) im Einsatz – deshalb schon vorab per offsetSeconds
  // ausgeglichen, statt die Route nachträglich neu zu planen.
  teams: [
    {
      id: "T1", name: "Die Füchse", emoji: "🦊", color: "#e2711d", code: "1111",
      route: ["W2", "W8", "W3", "W6", "W4", "W5", "W7", "W1"],   // 4,63 km Fußweg, 3,40 km Luftlinie
      offsetSeconds: 195,
    },
    {
      id: "T2", name: "Die Eulen", emoji: "🦉", color: "#7b5ea7", code: "2222",
      route: ["W6", "W3", "W5", "W7", "W1", "W4", "W8", "W2"],   // 4,50 km Fußweg, 3,40 km Luftlinie
      offsetSeconds: 75,
    },
    {
      id: "T3", name: "Die Dachse", emoji: "🦡", color: "#4f6d7a", code: "3333",
      route: ["W1", "W5", "W4", "W8", "W7", "W2", "W3", "W6"],   // 4,44 km Fußweg, 3,42 km Luftlinie
      offsetSeconds: 30,
    },
    {
      id: "T4", name: "Die Igel", emoji: "🦔", color: "#8a5a44", code: "4444",
      route: ["W3", "W6", "W2", "W4", "W5", "W1", "W8", "W7"],   // 4,41 km Fußweg, 3,45 km Luftlinie
      offsetSeconds: 0,
    },
    {
      id: "T5", name: "Die Falken", emoji: "🦅", color: "#2a6f4e", code: "5555",
      route: ["W4", "W2", "W6", "W5", "W3", "W7", "W1", "W8"],   // 5,02 km Fußweg, 3,61 km Luftlinie
      // Längste Route (5,02 km) – 611 m mehr als die kürzeste
      // (4,41 km, T4); Ausgleich bei ~4 km/h Kindertempo.
      offsetSeconds: 555,
    },
  ],
};

// (nicht ändern – macht die Konfiguration für index.html & setup.html verfügbar)
if (typeof window !== "undefined") window.GAME_CONFIG = CONFIG;
