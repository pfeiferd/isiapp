/* ============================================================
   Schatzsuche im Ziegeleipark – Spiellogik
   Reines Vanilla-JavaScript, keine Abhängigkeiten.
   ============================================================ */
(function () {
  "use strict";

  const CFG = window.GAME_CONFIG;
  const STORAGE_KEY = "ziegelei-hunt-v1";

  // ---------- Spielzustand ----------
  // phase: "title" | "story" | "nav" | "station" | "penalty" | "finish" | "done"
  let state = {
    teamId: null,
    phase: "title",
    startedAt: null,        // Epoch ms
    finishedAt: null,
    legIndex: 0,            // 0..route.length-1 = Stationen, route.length = zurück zur Basis
    attempts: 0,            // Fehlversuche an der aktuellen Station
    penaltyUntil: null,     // Epoch ms
    solvedCount: 0,
    wrongCount: 0,
    testMode: false,
  };

  // ---------- Laufzeit (nicht gespeichert) ----------
  let watchId = null;
  let lastPos = null;       // GeolocationPosition
  let compassHeading = null; // Grad, 0 = Norden
  let wakeLock = null;
  let timerInterval = null;
  let gmTapCount = 0;
  let gmTapTimer = null;

  const $ = (id) => document.getElementById(id);

  // ============================================================
  //  Hilfsfunktionen
  // ============================================================

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) state = Object.assign(state, JSON.parse(raw));
    } catch (e) {}
  }

  function team() {
    return CFG.teams.find((t) => t.id === state.teamId) || null;
  }

  function route() {
    const t = team();
    return t ? t.route.map((id) => CFG.waypoints.find((w) => w.id === id)).filter(Boolean) : [];
  }

  // Aktuelles Ziel: Station oder (am Ende) das Basislager
  function currentTarget() {
    const r = route();
    if (state.legIndex < r.length) return r[state.legIndex];
    return Object.assign({ isBase: true, id: "BASE", hint: CFG.start.finishText }, CFG.start);
  }

  function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
  }

  function bearingTo(lat1, lon1, lat2, lon2) {
    const toRad = (d) => (d * Math.PI) / 180;
    const toDeg = (r) => (r * 180) / Math.PI;
    const y = Math.sin(toRad(lon2 - lon1)) * Math.cos(toRad(lat2));
    const x =
      Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
      Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lon2 - lon1));
    return (toDeg(Math.atan2(y, x)) + 360) % 360;
  }

  function cardinal(deg) {
    const dirs = ["Norden", "Nordosten", "Osten", "Südosten",
                  "Süden", "Südwesten", "Westen", "Nordwesten"];
    return dirs[Math.round(deg / 45) % 8];
  }

  function fmtTime(totalSeconds) {
    totalSeconds = Math.max(0, Math.round(totalSeconds));
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const mm = String(m).padStart(2, "0");
    const ss = String(s).padStart(2, "0");
    return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
  }

  function elapsedSeconds() {
    if (!state.startedAt) return 0;
    const end = state.finishedAt || Date.now();
    return (end - state.startedAt) / 1000;
  }

  // ============================================================
  //  Screens
  // ============================================================

  function showScreen(id) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    $(id).classList.add("active");
    window.scrollTo(0, 0);
  }

  function applyTeamColor() {
    const t = team();
    if (t) document.documentElement.style.setProperty("--team-color", t.color);
  }

  // Team aus der URL (?team=T1) – so startet der QR-Code eines Teams direkt,
  // ohne Teamwahl und ohne Code-Eingabe.
  function teamFromUrl() {
    const raw = new URLSearchParams(location.search).get("team");
    if (!raw) return null;
    const key = raw.trim().toUpperCase();
    return CFG.teams.find((t) => t.id.toUpperCase() === key) || null;
  }

  // ---------- Titel / Teamwahl ----------
  function renderTitle() {
    $("title-heading").textContent = CFG.story.title;
    $("title-teaser").textContent = CFG.story.teaser;
    const list = $("team-list");
    list.innerHTML = "";
    CFG.teams.forEach((t) => {
      const btn = document.createElement("button");
      btn.className = "team-btn";
      btn.style.borderColor = t.color;
      btn.innerHTML = `<span class="team-emoji">${t.emoji}</span> ${t.name}`;
      btn.addEventListener("click", () => {
        pendingTeam = t;
        $("code-emoji").textContent = t.emoji;
        $("code-team-name").textContent = t.name;
        $("code-input").value = "";
        $("code-error").classList.add("hidden");
        showScreen("screen-code");
        setTimeout(() => $("code-input").focus(), 100);
      });
      list.appendChild(btn);
    });
    showScreen("screen-title");
  }

  let pendingTeam = null;

  function startWithTeam(t) {
    state = {
      teamId: t.id,
      phase: "story",
      startedAt: null,
      finishedAt: null,
      legIndex: 0,
      attempts: 0,
      penaltyUntil: null,
      solvedCount: 0,
      wrongCount: 0,
      testMode: state.testMode,
    };
    save();
  }

  function checkTeamCode() {
    const val = $("code-input").value.trim();
    if (pendingTeam && val === pendingTeam.code) {
      startWithTeam(pendingTeam);
      applyTeamColor();
      renderStory();
    } else {
      $("code-error").classList.remove("hidden");
    }
  }

  // ---------- Geschichte ----------
  function renderStory() {
    $("story-title").textContent = CFG.story.title;
    $("story-text").textContent = CFG.story.text;
    const ul = $("story-rules");
    ul.innerHTML = "";
    CFG.story.rules.forEach((r) => {
      const li = document.createElement("li");
      li.textContent = r;
      ul.appendChild(li);
    });
    showScreen("screen-story");
    // GPS schon einmal antesten (Berechtigungs-Dialog kommt so früh wie möglich)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          $("gps-check-status").textContent =
            `✅ GPS funktioniert! (Genauigkeit: ±${Math.round(pos.coords.accuracy)} m)`;
        },
        (err) => {
          $("gps-check-status").textContent =
            "⚠️ Noch kein GPS-Signal. Bitte Standort erlauben und nach draußen gehen! (" + err.message + ")";
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      $("gps-check-status").textContent = "❌ Dieses Gerät unterstützt kein GPS im Browser.";
    }
  }

  async function startGame() {
    // iOS: Kompass-Berechtigung muss aus einem Klick heraus angefragt werden
    if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === "function") {
      try { await DeviceOrientationEvent.requestPermission(); } catch (e) {}
    }
    if (!state.startedAt) {
      state.startedAt = Date.now();
      state.legIndex = 0;
      state.attempts = 0;
    }
    state.phase = "nav";
    save();
    startWatching();
    requestWakeLock();
    renderNav();
  }

  // ---------- Navigation ----------
  function renderNav() {
    const t = team();
    const tgt = currentTarget();
    const r = route();
    $("hud-team").textContent = t.emoji;
    $("hud-progress").textContent = tgt.isBase
      ? "🏠 Zurück zur Basis"
      : `Station ${state.legIndex + 1}/${r.length}`;
    $("nav-target-label").textContent = tgt.isBase ? "🏠 Zurück zum Basislager!" : "🎯 Nächstes Ziel";
    $("nav-hint").textContent = tgt.isBase ? CFG.start.finishText : tgt.hint;
    $("btn-arrived").disabled = true;
    $("btn-arrived").textContent = tgt.isBase ? "🏆 Wir sind zurück!" : "🏁 Wir sind da!";
    $("btn-simulate").classList.toggle("hidden", !state.testMode);
    showScreen("screen-nav");
    updateNavDisplay();
  }

  function updateNavDisplay() {
    if (state.phase !== "nav") return;
    const tgt = currentTarget();
    if (!lastPos) {
      $("nav-geo-status").textContent = "Warte auf GPS-Signal … 📡";
      return;
    }
    const { latitude, longitude, accuracy, heading } = lastPos.coords;
    const dist = haversine(latitude, longitude, tgt.lat, tgt.lon);
    const brg = bearingTo(latitude, longitude, tgt.lat, tgt.lon);

    $("nav-distance").textContent = dist >= 1000
      ? (dist / 1000).toFixed(2).replace(".", ",") + " km"
      : Math.round(dist) + " m";
    $("nav-direction-label").textContent = cardinal(brg);
    $("nav-direction-arrow").style.transform = `rotate(${Math.round(brg / 45) * 45}deg)`;
    $("nav-geo-status").textContent = `GPS-Genauigkeit: ±${Math.round(accuracy)} m` +
      (accuracy > 35 ? " – freien Himmel suchen!" : "");

    // Gehäuse (inkl. "N" und Zielmarkierung) steht fest, an ihrer wahren Peilung ab Nord –
    // nur die Nadel dreht sich (echtes Kompassverhalten). Die Kinder müssen sich selbst
    // drehen, bis die Nadel aufs feste "N" zeigt; das 🎯 zeigt dann die Laufrichtung.
    let hdg = compassHeading;
    if (hdg == null && heading != null && !isNaN(heading)) hdg = heading;
    const northRot = hdg == null ? 0 : -hdg;
    $("compass-arrow").style.transform = `rotate(${northRot}deg)`;
    $("compass-target").style.transform = `rotate(${brg}deg)`;

    const radius = tgt.radius || CFG.settings.arrivalRadius;
    const arrived = dist <= Math.max(radius, Math.min(accuracy, 40));
    $("btn-arrived").disabled = !arrived;
    if (arrived) $("nav-geo-status").textContent = "🎯 Ihr seid nah genug – drückt den Knopf!";
  }

  function onArrived() {
    const tgt = currentTarget();
    if (tgt.isBase) {
      finishGame();
    } else {
      state.phase = "station";
      state.attempts = 0;
      save();
      renderStation();
    }
  }

  // ---------- Station: Versteck & Rätsel ----------
  function renderStation() {
    const t = team();
    const r = route();
    const wp = r[state.legIndex];
    $("hud-team2").textContent = t.emoji;
    $("hud-progress2").textContent = `Station ${state.legIndex + 1}/${r.length}`;
    $("station-name").textContent = wp.name;
    if (wp.cache) {
      $("station-cache-card").classList.remove("hidden");
      $("station-cache").textContent = wp.cache;
    } else {
      $("station-cache-card").classList.add("hidden");
    }
    $("station-riddle").textContent = wp.riddle.text;
    $("answer-input").value = "";
    updateAttemptsLabel();
    showScreen("screen-station");
  }

  function updateAttemptsLabel() {
    const max = CFG.settings.maxAttempts;
    $("station-attempts").textContent =
      state.attempts === 0
        ? `Ihr habt ${max} Versuche.`
        : `❌ Schon ${state.attempts} von ${max} Versuchen verbraucht!`;
  }

  function normalizeAnswer(s) {
    s = String(s).trim().replace(",", ".");
    const n = Number(s);
    return isNaN(n) ? s.toLowerCase() : String(n);
  }

  function submitAnswer() {
    const wp = route()[state.legIndex];
    const given = $("answer-input").value;
    if (!given.trim()) return;

    // Spielleiter-Code: Station ohne Strafe überspringen (z. B. bei GPS-Problemen)
    if (given.trim() === CFG.settings.gmCode) {
      advance(true);
      return;
    }

    if (normalizeAnswer(given) === normalizeAnswer(wp.riddle.answer)) {
      state.solvedCount++;
      save();
      $("success-text").textContent = wp.cache
        ? "Das Rätsel ist gelöst! Habt ihr eure Goldmünze aus dem Versteck? Dann weiter!"
        : "Das Rätsel ist gelöst – weiter geht's!";
      showScreen("screen-success");
    } else {
      state.attempts++;
      state.wrongCount++;
      if (state.attempts >= CFG.settings.maxAttempts) {
        save();
        $("skipped-answer").textContent = wp.riddle.answer;
        showScreen("screen-skipped");
      } else {
        state.phase = "penalty";
        state.penaltyUntil = Date.now() + CFG.settings.penaltySeconds * 1000;
        save();
        $("penalty-info").textContent = wp.riddle.tip ? "💡 Tipp: " + wp.riddle.tip : "";
        showScreen("screen-penalty");
      }
    }
  }

  function tickPenalty() {
    if (state.phase !== "penalty") return;
    const remain = (state.penaltyUntil - Date.now()) / 1000;
    if (remain <= 0) {
      state.phase = "station";
      state.penaltyUntil = null;
      save();
      renderStation();
    } else {
      const m = Math.floor(remain / 60);
      const s = Math.floor(remain % 60);
      $("penalty-count").textContent = `${m}:${String(s).padStart(2, "0")}`;
    }
  }

  function advance() {
    state.legIndex++;
    state.attempts = 0;
    state.phase = "nav";
    save();
    renderNav();
  }

  // ---------- Ziel ----------
  function finishGame() {
    if (!state.finishedAt) {
      state.finishedAt = Date.now();
      state.phase = "finish";
      save();
    }
    stopWatching();
    $("finish-result-card").classList.add("hidden");
    $("finish-input-card").classList.remove("hidden");
    showScreen("screen-finish");
  }

  function showResult() {
    const t = team();
    const inputVal = parseInt($("coins-input").value, 10);
    const coins = Math.max(0, isNaN(inputVal) ? (state.coins || 0) : inputVal);
    state.coins = coins;
    const gross = elapsedSeconds();
    const coinBonus = coins * CFG.settings.coinBonusSeconds;
    const offset = t.offsetSeconds || 0;
    const total = Math.max(0, gross - coinBonus - offset);
    const routeLen = route().length;

    $("res-time").textContent = fmtTime(gross);
    $("res-coins").textContent = `− ${fmtTime(coinBonus)} (${coins} 💰)`;
    $("res-offset-line").classList.toggle("hidden", offset === 0);
    $("res-offset").textContent = `− ${fmtTime(offset)}`;
    $("res-solved").textContent = `${state.solvedCount} von ${routeLen}`;
    $("res-total").textContent = fmtTime(total);

    const ranks = [
      [0, "🥇 Meister-Schatzsucher!"],
      [4, "🥈 Spitzen-Spürnasen!"],
      [6, "🥉 Wackere Abenteurer!"],
    ];
    let rank = ranks[0][1];
    for (const [minWrong, label] of ranks) if (state.wrongCount >= minWrong) rank = label;
    $("res-rank").textContent = rank;

    $("finish-input-card").classList.add("hidden");
    $("finish-result-card").classList.remove("hidden");
    state.phase = "done";
    save();
  }

  // ============================================================
  //  GPS & Kompass & WakeLock
  // ============================================================

  function startWatching() {
    if (watchId != null || !navigator.geolocation) return;
    watchId = navigator.geolocation.watchPosition(
      (pos) => { lastPos = pos; updateNavDisplay(); },
      (err) => { $("nav-geo-status").textContent = "⚠️ GPS-Problem: " + err.message; },
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 15000 }
    );
    const onOrient = (e) => {
      if (e.webkitCompassHeading != null) {
        compassHeading = e.webkitCompassHeading;          // iOS
      } else if (e.absolute && e.alpha != null) {
        compassHeading = (360 - e.alpha) % 360;           // Android (absolute)
      }
    };
    window.addEventListener("deviceorientationabsolute", onOrient, true);
    window.addEventListener("deviceorientation", onOrient, true);
  }

  function stopWatching() {
    if (watchId != null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
      watchId = null;
    }
  }

  async function requestWakeLock() {
    try {
      if ("wakeLock" in navigator) {
        wakeLock = await navigator.wakeLock.request("screen");
        document.addEventListener("visibilitychange", async () => {
          if (document.visibilityState === "visible" && wakeLock !== null) {
            try { wakeLock = await navigator.wakeLock.request("screen"); } catch (e) {}
          }
        });
      }
    } catch (e) {}
  }

  // ============================================================
  //  Spielleiter-Menü & Testmodus
  // ============================================================

  function gmTap() {
    gmTapCount++;
    clearTimeout(gmTapTimer);
    gmTapTimer = setTimeout(() => (gmTapCount = 0), 2500);
    if (gmTapCount >= 7) {
      gmTapCount = 0;
      $("gm-overlay").classList.add("active");
    }
  }

  function gmSkip() {
    $("gm-overlay").classList.remove("active");
    if (state.phase === "nav" || state.phase === "station" || state.phase === "penalty") {
      const tgt = currentTarget();
      state.penaltyUntil = null;
      if (tgt.isBase) finishGame();
      else advance();
    }
  }

  function gmToggleTest() {
    state.testMode = !state.testMode;
    save();
    $("gm-overlay").classList.remove("active");
    if (state.phase === "nav") renderNav();
    alert("Testmodus ist jetzt " + (state.testMode ? "AN 🧪" : "AUS"));
  }

  function gmReset() {
    if (confirm("Wirklich ALLES zurücksetzen? Der Spielstand dieses Teams geht verloren!")) {
      localStorage.removeItem(STORAGE_KEY);
      // ohne Query-Parameter neu laden, sonst startet ?team=… sofort wieder
      location.replace(location.pathname);
    }
  }

  // ============================================================
  //  Initialisierung
  // ============================================================

  function bind() {
    $("btn-code-ok").addEventListener("click", checkTeamCode);
    $("code-input").addEventListener("keydown", (e) => { if (e.key === "Enter") checkTeamCode(); });
    $("btn-code-back").addEventListener("click", renderTitle);
    $("btn-start").addEventListener("click", startGame);
    $("btn-arrived").addEventListener("click", onArrived);
    $("btn-simulate").addEventListener("click", onArrived);
    $("btn-answer").addEventListener("click", submitAnswer);
    $("answer-input").addEventListener("keydown", (e) => { if (e.key === "Enter") submitAnswer(); });
    $("btn-next").addEventListener("click", advance);
    $("btn-next2").addEventListener("click", advance);
    $("btn-finish").addEventListener("click", showResult);
    $("hud-timer").addEventListener("click", gmTap);
    $("hud-timer2").addEventListener("click", gmTap);
    $("gm-skip").addEventListener("click", gmSkip);
    $("gm-testmode").addEventListener("click", gmToggleTest);
    $("gm-reset").addEventListener("click", gmReset);
    $("gm-close").addEventListener("click", () => $("gm-overlay").classList.remove("active"));
  }

  function tick() {
    const el = fmtTime(elapsedSeconds());
    $("hud-timer").textContent = el;
    $("hud-timer2").textContent = el;
    tickPenalty();
  }

  function resume() {
    // ?test=1 in der URL schaltet den Testmodus ein (für Proben am Schreibtisch)
    if (new URLSearchParams(location.search).get("test") === "1") state.testMode = true;

    // ?team=T1 (aus dem QR-Code des Teams): Team steht fest, Code-Eingabe entfällt.
    const linked = teamFromUrl();
    if (linked && linked.id !== state.teamId) {
      const running = state.phase === "title" ? null : team();
      if (!running || confirm(
        `Auf diesem Handy läuft schon das Spiel von ${running.emoji} ${running.name}.\n\n` +
        `Wirklich zu ${linked.emoji} ${linked.name} wechseln? Der bisherige Spielstand geht dabei verloren!`
      )) {
        startWithTeam(linked);
      }
    }

    if (!state.teamId || state.phase === "title") { renderTitle(); return; }
    applyTeamColor();
    switch (state.phase) {
      case "story": renderStory(); break;
      case "nav": startWatching(); requestWakeLock(); renderNav(); break;
      case "station": startWatching(); requestWakeLock(); renderStation(); break;
      case "penalty": startWatching(); requestWakeLock(); showScreen("screen-penalty"); break;
      case "finish": finishGame(); break;
      case "done": finishGame(); showResult(); break;
      default: renderTitle();
    }
  }

  load();
  bind();
  timerInterval = setInterval(tick, 500);
  resume();
})();
