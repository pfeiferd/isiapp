// ============================================================
//  KONFIGURATION – Schatzsuche im Ziegeleipark
//  Diese Datei ist die EINZIGE, die du anpassen musst.
//
//  Die Koordinaten stammen aus OpenStreetMap (Stand 09/2026):
//  Basislager, Ziegeleisee, Spielplatz Bruhweg, Aussichtspunkt
//  und Haus am See sind echte Orte. W1/W5/W7/W8 sind sinnvoll
//  im Park platziert, sollten aber VOR ORT feinjustiert werden
//  (setup.html öffnen -> hinlaufen -> "Hier setzen" drücken).
// ============================================================

const CONFIG = {

  // ---------- Allgemeine Spieleinstellungen ----------
  settings: {
    arrivalRadius: 25,      // Meter: so nah muss man ran, bis "Wir sind da!" freigeschaltet wird
    penaltySeconds: 120,    // Zeitstrafe (Wartezeit) pro falscher Antwort
    maxAttempts: 3,         // nach so vielen Fehlversuchen geht es ohne Lösung weiter
    coinBonusSeconds: 240,  // jede gesammelte Münze zählt so viele Sekunden Zeitgutschrift
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
      "Jede Münze bringt am Ende Zeitgutschrift. Das schnellste Team (nach Gutschrift) gewinnt.",
      "Achtet auf Wege, Radfahrer und andere Parkbesucher!",
    ],
  },

  // ---------- Start & Ziel (Basislager) ----------
  start: {
    name: "Basislager – Im Jockele 13",
    lat: 49.129997,         // aus OpenStreetMap (Gebäude Im Jockele 13)
    lon: 9.187387,
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
      hint: "Folgt dem 🎯-Zielsymbol! Ihr seid richtig, wo man Jakobs Reich betritt und eine Tafel die Besucher grüßt.",
      lat: 49.13145, lon: 9.18385, radius: 25,   // Parkeingang SO – vor Ort prüfen!
      cache: "Direkt unter der Begrüßungstafel liegt eine kleine Dose. EINE Münze nehmen, Dose genau so zurücklegen!",
      riddle: {
        text: "Jakobs Ringofen hatte 14 Kammern. In jeder Kammer wurden genau 250 Ziegel gebrannt. Wie viele Ziegel waren das bei einem Brand insgesamt?",
        answer: "3500",
        tip: "14 × 250 – rechnet in Ruhe, sonst gibt's eine Zeitstrafe!",
      },
    },
    {
      id: "W2",
      name: "Der Wolkenspiegel",
      hint: "Folgt dem 🎯-Zielsymbol zu dem Ort, an dem sich der Himmel spiegelt und gefiederte Wächter schwimmen.",
      lat: 49.13357, lon: 9.18037, radius: 25,   // Ziegeleisee (OSM) – Bank am Ufer wählen!
      cache: "Sucht unter der Bank mit Blick aufs Wasser: Dort klebt/liegt eine kleine Dose. Nehmt EINE Goldmünze für euer Team und legt die Dose genau so zurück!",
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
      lat: 49.13188, lon: 9.17630, radius: 30,   // Aussichtspunkt West (OSM)
      cache: "Unter der Bank mit dem besten Ausblick liegt der Hexen-Schatz: eine kleine Dose. EINE Münze nehmen, Dose genau so zurücklegen!",
      riddle: {
        text: "In der Vollmondnacht treffen sich hier 3 Hexen zum Tanz – und jede bringt 2 Schwestern mit. Dann kommt noch der Kater der ältesten Hexe dazu und tanzt mit! Wie viele tanzen im Hexenkreis?",
        answer: "10",
        tip: "3 Hexen + ihre Schwestern (3 × 2) + 1 Kater.",
      },
    },
    {
      id: "W4",
      name: "Der Tummelplatz",
      hint: "Wo früher Jakobs Arbeiter rasteten, wird heute getobt und geklettert. Das 🎯-Zielsymbol zeigt euch den Weg!",
      lat: 49.13466, lon: 9.18054, radius: 25,   // Spielplatz Bruhweg (OSM)
      cache: "Am Rand des Spielplatzes, beim dicksten Baum, liegt unter einem auffälligen Stein eine Dose. EINE Münze nehmen, Stein wieder drauflegen!",
      riddle: {
        text: "Ich bin eine geheime Zahl. Verdoppelt man mich und zählt dann 8 dazu, kommt 30 heraus. Welche Zahl bin ich?",
        answer: "11",
        tip: "Rechnet rückwärts: erst 8 abziehen, dann halbieren.",
      },
    },
    {
      id: "W5",
      name: "Die alte Lehmgrube",
      hint: "Unter dieser Wiese schlummert die Grube, aus der Jakob einst seinen Lehm holte. Nur das 🎯-Zielsymbol kennt die Stelle!",
      lat: 49.13180, lon: 9.17750, radius: 30,   // SW-Wiese – vor Ort markanten Punkt wählen!
      cache: "Am Rand der Wiese, unter einem platten Stein, liegt eine kleine Dose mit Jakobs Lehm-Schatz. EINE Münze nehmen, Stein genau so zurücklegen!",
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
      lat: 49.133645, lon: 9.174423, radius: 25,   // Foto-Spot Mostbirnenweg (OSM)
      cache: "Am Fuß des roten Rahmens liegt unter einem auffälligen Stein eine kleine Dose. EINE Münze nehmen, Stein genau so zurücklegen!",
      riddle: {
        text: "Wer durch das Rote Tor der Zeit schaut, blickt genau 100 Jahre zurück – bis in die Tage der alten Ziegelei! Wir haben das Jahr 2026. Welches Jahr seht ihr durch das Tor?",
        answer: "1926",
        tip: "2026 minus 100.",
      },
    },
    {
      id: "W7",
      name: "Die Säule des Himmels",
      hint: "Folgt dem 🎯-Zielsymbol zu Jakobs steinernem Wächter, der den Himmel trägt. Erst ganz nah verrät er euch sein Geheimnis.",
      lat: 49.133292, lon: 9.185217, radius: 30,   // Wasserturm Böckingen (OSM)
      cache: "Am Fuß des Turms, zwischen den Wurzeln des nächsten Baumes, liegt eine kleine Dose. EINE Münze nehmen, alles wieder gut tarnen!",
      riddle: {
        // Baujahr laut Wikipedia: 1929 – bitte vor Ort prüfen, dass die
        // Jahreszahl am Turm sichtbar ist (sonst Rätsel/Antwort anpassen)!
        text: "Die Säule des Himmels verrät ihr Alter nur dem, der genau hinschaut: Sucht an ihr die Jahreszahl ihrer Erbauung und gebt sie als Code ein!",
        answer: "1929",
        tip: "Geht einmal um den Turm herum und schaut auch über den Eingang.",
      },
    },
    {
      id: "W8",
      name: "Jakobs Uhr",
      hint: "Im äußersten Winkel von Jakobs Reich, wo der Weg sich um die Gärten schmiegt, blieb die Zeit stehen.",
      lat: 49.13476, lon: 9.18226, radius: 25,   // NO-Ecke – vor Ort markanten Punkt wählen!
      cache: "Hinter/unter dem vereinbarten Objekt steckt eine Dose. EINE Münze nehmen und Dose genau so zurücklegen!",
      riddle: {
        text: "Auf Jakobs alter Uhr steht der kleine Zeiger auf der 3, der große auf der 12. Wie viele Minuten dauert es, bis der GROSSE Zeiger auf der 6 steht?",
        answer: "30",
        tip: "Der große Zeiger braucht 60 Minuten für eine ganze Runde.",
      },
    },
  ],

  // ---------- Teams & Routen ----------
  // Jedes Team besucht ALLE Stationen, aber in anderer Reihenfolge,
  // damit die Teams nicht nebeneinander herlaufen.
  // "offsetSeconds": Zeit-Ausgleich, falls eine Route deutlich länger ist
  //                  (positiv = Gutschrift für dieses Team).
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
      route: ["W2", "W8", "W3", "W6", "W4", "W5", "W7", "W1"],   // ≈ 3,58 km Luftlinie
      offsetSeconds: 0,
    },
    {
      id: "T2", name: "Die Eulen", emoji: "🦉", color: "#7b5ea7", code: "2222",
      route: ["W6", "W3", "W5", "W7", "W1", "W4", "W8", "W2"],   // ≈ 3,56 km Luftlinie
      offsetSeconds: 0,
    },
    {
      id: "T3", name: "Die Dachse", emoji: "🦡", color: "#4f6d7a", code: "3333",
      route: ["W1", "W5", "W4", "W8", "W7", "W2", "W3", "W6"],   // ≈ 3,52 km Luftlinie
      offsetSeconds: 0,
    },
    {
      id: "T4", name: "Die Igel", emoji: "🦔", color: "#8a5a44", code: "4444",
      route: ["W3", "W6", "W2", "W4", "W5", "W1", "W8", "W7"],   // ≈ 3,53 km Luftlinie
      offsetSeconds: 0,
    },
    {
      id: "T5", name: "Die Falken", emoji: "🦅", color: "#2a6f4e", code: "5555",
      route: ["W4", "W2", "W6", "W5", "W3", "W7", "W1", "W8"],   // ≈ 3,59 km Luftlinie, 5,09 km realer Fußweg (Valhalla)
      // Falken-Route ist ~480m länger als der Schnitt der anderen 4 Teams (4,61 km) –
      // Zeitvorsprung als Ausgleich (bei ~4 km/h Kindertempo ≈ 7 Min), wird am Ende abgezogen.
      offsetSeconds: 420,
    },
  ],
};

// (nicht ändern – macht die Konfiguration für index.html & setup.html verfügbar)
if (typeof window !== "undefined") window.GAME_CONFIG = CONFIG;
