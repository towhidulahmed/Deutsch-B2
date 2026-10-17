/* B2 Karteikarten: a flashcard-only site. The words come from the main site's day files
   (../classes/*.js), which call B2.addClass() and B2.addWords(); this file collects them. */
(function () {
  "use strict";

  var CLASSES = [];
  var WORDS = {};  // extra word lists per day, e.g. the A1–B1 Grundwortschatz in Tag 0
  window.B2 = {
    addClass: function (c) { CLASSES.push(c); },
    addWords: function (id, list) { WORDS[id] = (WORDS[id] || []).concat(list); }
  };

  /* ---------- storage (fails quietly in private windows) ---------- */
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  };
  // Box per card: 0 = not known yet, 1–5 = known that many times in a row.
  var boxes = store.get("fcBox", {});
  var settings = Object.assign({ reverse: false, auto: true, slow: false, size: 20 }, store.get("fcSettings", {}));
  function saveSettings() { store.set("fcSettings", settings); }

  /* ---------- helpers ---------- */
  function $(sel, el) { return (el || document).querySelector(sel); }
  function $$(sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function reduced() { return window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches; }
  var ICON = {
    say: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9zm12.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"/></svg>',
    undo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.5 8c-2.6 0-5 1-6.9 2.6L2 7v9h9l-3.6-3.6A7.5 7.5 0 0 1 19.5 16l2.4-.8A10 10 0 0 0 12.5 8z"/></svg>',
    down: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.4 8.6 12 13.2l4.6-4.6L18 10l-6 6-6-6z"/></svg>',
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.4 5.4 14 4l-8 8 8 8 1.4-1.4L8.8 12z"/></svg>',
    theme: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 2v16a8 8 0 0 1 0-16z"/></svg>'
  };

  /* ---------- decks ---------- */
  function sorted() { return CLASSES.slice().sort(function (a, b) { return a.nr - b.nr; }); }
  function card(c, v, kind) {
    return { de: v.de, gram: v.gram, en: v.en, ex: v.ex, lvl: v.lvl, t: v.t, kind: kind, day: c, key: c.id + "|" + (kind === "satz" ? "s|" : "") + v.de };
  }
  var DECKS = [];
  function buildDecks() {
    DECKS = [];
    var everyDay = [];
    sorted().forEach(function (c) {
      var words = (c.vocab || []).map(function (v) { return card(c, v, "wort"); });
      var all = words.slice();
      everyDay = everyDay.concat(words);
      if (words.length) DECKS.push({ id: c.id + "-w", day: c, name: "Nur Wörter", cards: words });
      var extra = WORDS[c.id] || [];
      ["A1", "A2", "B1"].forEach(function (l) {
        var list = extra.filter(function (v) { return v.lvl === l; }).map(function (v) { return card(c, v, "wort"); });
        if (list.length) DECKS.push({ id: c.id + "-" + l, day: c, name: "Grundwortschatz " + l, cards: list });
        all = all.concat(list);
      });
      var phrases = [];
      (c.dialogues || []).forEach(function (d) {
        (d.phrases || []).forEach(function (ph) { phrases.push(card(c, { de: ph.de, en: ph.en, t: d.title }, "satz")); });
      });
      if (phrases.length) DECKS.push({ id: c.id + "-s", day: c, name: "Sätze aus den Gesprächen", cards: phrases });
      all = all.concat(phrases);
      if (all.length > words.length) DECKS.push({ id: c.id + "-alle", day: c, name: "Alles", cards: all });
    });
    if (everyDay.length) DECKS.unshift({ id: "alle", day: null, name: "Alle Wörter von Tag 0 bis " + sorted()[sorted().length - 1].nr, cards: everyDay });
  }
  function deckById(id) { for (var i = 0; i < DECKS.length; i++) if (DECKS[i].id === id) return DECKS[i]; return null; }
  function known(d) { return d.cards.filter(function (v) { return boxes[v.key] > 0; }).length; }

  /* ---------- pronunciation (device voices, works offline) ---------- */
  var speech = (function () {
    var synth = window.speechSynthesis;
    var voice = null;
    var ok = !!synth && typeof window.SpeechSynthesisUtterance === "function";
    function pick() {
      var vs = synth.getVoices();
      var de = vs.filter(function (v) { return /^de([-_]|$)/i.test(v.lang); });
      de.sort(function (a, b) { return (/de[-_]DE/i.test(b.lang) ? 1 : 0) - (/de[-_]DE/i.test(a.lang) ? 1 : 0) || (b.localService ? 1 : 0) - (a.localService ? 1 : 0); });
      voice = de[0] || null;
    }
    if (ok) {
      pick();
      if (synth.addEventListener) synth.addEventListener("voiceschanged", pick); else synth.onvoiceschanged = pick;
    } else document.documentElement.classList.add("no-speech");
    function clean(t) {
      return String(t).replace(/\([^)]*\)/g, "").replace(/\s*\/\s*/g, ", ").replace(/[+]\s*(Akk|Dat)\w*/g, "").replace(/…/g, "").replace(/\s+/g, " ").trim();
    }
    return {
      ok: ok,
      hasGerman: function () { return !!voice; },
      say: function (text) {
        if (!ok || !text) return;
        synth.cancel();
        var u = new SpeechSynthesisUtterance(clean(text));
        u.lang = "de-DE"; if (voice) u.voice = voice; u.rate = settings.slow ? 0.65 : 0.9;
        synth.speak(u);
      },
      stop: function () { if (ok) synth.cancel(); }
    };
  })();

  /* ---------- theme ---------- */
  function toggleTheme() {
    var dark = document.documentElement.getAttribute("data-theme") !== "dark";
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    store.set("fcTheme", dark ? "dark" : "light");
    var m = $('meta[name="theme-color"]'); if (m) m.content = dark ? "#12151c" : "#f6f7f9";
  }

  /* ---------- routing ---------- */
  var app;
  var cleanup = null;
  function route() {
    if (cleanup) { cleanup(); cleanup = null; }
    speech.stop();
    var m = location.hash.match(/^#\/(.+)$/);
    var d = m && deckById(decodeURIComponent(m[1]));
    if (d) study(d); else home();
  }

  /* ---------- home: pick a deck ---------- */
  function tile(d) {
    var n = d.cards.length, k = known(d);
    return '<a class="deck" href="#/' + encodeURIComponent(d.id) + '"><span class="deck-name">' + esc(d.name) + '</span>' +
      '<span class="deck-meta">' + n + " Karten · " + k + " gewusst</span>" +
      '<span class="deck-bar"><span style="width:' + (n ? Math.round(k / n * 100) : 0) + '%"></span></span></a>';
  }
  function home() {
    document.title = "Deutsch B2 Karteikarten";
    var html = '<div class="home"><header class="home-top"><a class="brand" href="../">Deutsch <b>B2</b></a>' +
      '<button class="icon-btn" id="theme" aria-label="Hell oder dunkel umschalten">' + ICON.theme + "</button></header>" +
      '<h1>Karteikarten</h1><p class="lead">Wähle einen Stapel. Tippe auf die Karte zum Umdrehen, wische nach <b class="t-good">rechts</b>, wenn du das Wort weißt, und nach <b class="t-bad">links</b>, wenn du es noch üben willst.</p>';
    var all = deckById("alle");
    if (all) html += '<section class="day"><div class="decks">' + tile(all) + "</div></section>";
    sorted().forEach(function (c) {
      var list = DECKS.filter(function (d) { return d.day === c; });
      if (!list.length) return;
      html += '<section class="day"><h2><span class="day-nr">Tag ' + c.nr + "</span> " + esc(c.title) + '</h2><div class="decks">' + list.map(tile).join("") + "</div></section>";
    });
    if (!DECKS.length) html += '<p class="lead">Keine Karten gefunden.</p>';
    html += '<p class="foot">Dein Lernstand wird nur auf deinem Gerät gespeichert. <a href="../">Zur Lernseite</a></p></div>';
    app.innerHTML = html;
    $("#theme", app).addEventListener("click", toggleTheme);
    window.scrollTo(0, 0);
  }

  /* ---------- study: one round of swiping ---------- */
  function study(d) {
    document.title = d.name + " · B2 Karteikarten";
    window.scrollTo(0, 0);
    var round, history;

    function newRound() {
      // Cards you don't know yet come first, then the ones known least often.
      var pool = shuffle(d.cards.slice()).sort(function (a, b) { return (boxes[a.key] || 0) - (boxes[b.key] || 0); });
      var size = settings.size > 0 ? settings.size : pool.length;
      round = { queue: shuffle(pool.slice(0, size)), pos: 0, again: {}, yes: 0, no: 0 };
      history = [];
      render();
    }

    function title() { return (d.day ? "Tag " + d.day.nr + " · " : "") + d.name; }

    function frontBack(v) {
      var de = '<div class="w-de">' + article(v.de, v.gram) + "</div>" + (v.gram ? '<div class="w-gram">' + esc(v.gram) + "</div>" : "");
      var en = '<div class="w-en">' + esc(v.en) + "</div>";
      var tag = '<div class="c-tag">' + esc(v.kind === "satz" ? "Satz" : v.lvl || "Tag " + v.day.nr) + (v.t && v.kind !== "satz" ? " · " + esc(v.t) : "") + "</div>";
      var sayWord = '<button class="say big" type="button" data-say="w" aria-label="Wort anhören">' + ICON.say + "</button>";
      var exHtml = v.kind === "satz"
        ? (v.t ? '<div class="c-ctx">aus „' + esc(v.t) + "“</div>" : "")
        : (v.ex ? '<div class="c-ex"><button class="say" type="button" data-say="ex" aria-label="Beispielsatz anhören">' + ICON.say + "</button><span>" + esc(v.ex) + "</span></div>" : "");
      var front, back;
      if (settings.reverse) {
        front = tag + '<div class="c-main">' + en + "</div>";
        back = tag + '<div class="c-main">' + de + sayWord + '<div class="w-en small">' + esc(v.en) + "</div></div>" + exHtml;
      } else {
        front = tag + '<div class="c-main">' + de + sayWord + "</div>";
        back = tag + '<div class="c-main">' + en + '<div class="w-de small">' + esc(v.de) + "</div></div>" + exHtml;
      }
      return { front: front, back: back };
    }

    function cardHtml(v, depth) {
      var fb = frontBack(v);
      return '<div class="card' + (depth ? " under" : "") + '" style="--depth:' + depth + '"' + (depth ? ' aria-hidden="true"' : ' tabindex="0" role="button" aria-label="Karte umdrehen" id="top"') + ">" +
        '<div class="card-inner"><div class="face front">' + fb.front + "</div>" +
        '<div class="face back">' + fb.back + "</div></div>" +
        '<div class="stamp s-yes">Gewusst</div><div class="stamp s-no">Nochmal</div></div>';
    }

    function render() {
      var q = round.queue, i = round.pos;
      if (i >= q.length) return finished();
      var stack = "";
      // Draw the two next cards under the current one so the stack looks real.
      for (var k = Math.min(2, q.length - i - 1); k >= 0; k--) stack += cardHtml(q[i + k], k);
      app.innerHTML = '<div class="study"><div class="s-screen">' +
        '<header class="s-top"><a class="icon-btn" href="#/" aria-label="Zurück zur Übersicht">' + ICON.back + "</a>" +
        '<div class="s-title">' + esc(title()) + '</div><div class="s-count">' + (i + 1) + " / " + q.length + "</div>" +
        '<button class="icon-btn" id="b-undo" aria-label="Letzte Karte zurück" title="Letzte Karte zurück"' + (history.length ? "" : " disabled") + ">" + ICON.undo + "</button></header>" +
        '<div class="s-bar"><span style="width:' + Math.round(i / q.length * 100) + '%"></span></div>' +
        '<div class="stage" id="stage">' + stack + "</div>" +
        '<div class="s-swipe"><span class="t-bad">← nochmal</span><span>tippen = umdrehen</span><span class="t-good">gewusst →</span></div>' +
        '<a class="s-more" href="#opts" id="to-opts">Stapel und Optionen ' + ICON.down + "</a></div>" +
        optionsHtml() + "</div>";
      wire();
      wireOptions();
    }

    /* Below the card (scroll down): pick another deck of the same day, and the options. */
    function optionsHtml() {
      var sizes = [10, 20, 30, 50, 0];
      var near = DECKS.filter(function (x) { return d.day ? x.day === d.day : x.id === "alle" || /-alle$/.test(x.id); });
      var check = function (id, label, on) { return '<label class="row"><span>' + label + '</span><input type="checkbox" id="' + id + '"' + (on ? " checked" : "") + "></label>"; };
      return '<section class="s-opts" id="opts"><h2>Stapel' + (d.day ? " von Tag " + d.day.nr : "") + "</h2>" +
        '<div class="chips">' + near.map(function (x) {
          return '<a class="chip" href="#/' + encodeURIComponent(x.id) + '"' + (x === d ? ' aria-current="true"' : "") + ">" + esc(!d.day && x.day ? "Tag " + x.day.nr + " · " + x.name : x.name) + " <small>" + x.cards.length + "</small></a>";
        }).join("") + '<a class="chip" href="#/">Alle Tage …</a></div>' +
        "<h2>Optionen</h2>" +
        check("o-rev", "Bedeutung zuerst zeigen", settings.reverse) +
        check("o-auto", "Wörter automatisch vorlesen", settings.auto) +
        check("o-slow", "Langsam sprechen", settings.slow) +
        '<label class="row"><span>Karten pro Runde</span><select id="o-size">' + sizes.map(function (s) {
          return '<option value="' + s + '"' + (settings.size === s ? " selected" : "") + ">" + (s || "Alle") + "</option>";
        }).join("") + "</select></label>" +
        check("o-dark", "Dunkles Design", document.documentElement.getAttribute("data-theme") === "dark") +
        (!speech.ok ? '<p class="note">Dieser Browser kann nicht vorlesen.</p>' : !speech.hasGerman() ? '<p class="note">Keine deutsche Stimme gefunden. Installiere in den Geräteeinstellungen eine deutsche Sprachausgabe für die beste Aussprache.</p>' : "") +
        '<p class="note keys">Tastatur: Leertaste umdrehen · ← nochmal · → gewusst · S anhören · Z zurück</p>' +
        '<button class="btn" id="o-up">Zurück zur Karte</button></section>';
    }
    function wireOptions() {
      var on = function (id, fn) { var el = $("#" + id, app); if (el) el.addEventListener("change", function () { fn(el); saveSettings(); }); };
      on("o-rev", function (el) { settings.reverse = el.checked; render(); });
      on("o-auto", function (el) { settings.auto = el.checked; });
      on("o-slow", function (el) { settings.slow = el.checked; });
      on("o-size", function (el) { settings.size = +el.value; newRound(); });
      on("o-dark", function () { toggleTheme(); });
      var scrollTo = function (el) { if (el) el.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" }); };
      var more = $("#to-opts", app); if (more) more.addEventListener("click", function (e) { e.preventDefault(); scrollTo($("#opts", app)); });
      var up = $("#o-up", app); if (up) up.addEventListener("click", function () { scrollTo($(".s-screen", app)); });
    }

    var top, flipped, busy;
    function cur() { return round.queue[round.pos]; }
    function sayCur(what) { var v = cur(); if (v) speech.say(what === "ex" ? v.ex : v.de); }
    function flip() {
      if (!top || busy) return;
      flipped = !flipped;
      top.classList.toggle("flipped", flipped);
      if (flipped && settings.auto && settings.reverse) sayCur("w");
    }

    function wire() {
      top = $("#top", app); flipped = false; busy = false;
      var under = $$(".card.under", app);
      $("#b-undo", app).addEventListener("click", undo);
      $$(".say[data-say]", top).forEach(function (b) {
        b.addEventListener("click", function (e) { e.stopPropagation(); sayCur(b.getAttribute("data-say")); });
      });
      if (settings.auto && !settings.reverse) sayCur("w");

      /* Swiping. The card follows the finger (pointer capture keeps it attached even
         when the finger leaves the card); a fast flick or a long drag answers, anything
         else springs back. A tap without movement flips. */
      var drag = null;
      var width = function () { return top.offsetWidth || 320; };
      function place(dx, dy) {
        top.style.transform = "translate(" + dx + "px," + dy + "px) rotate(" + dx / 16 + "deg)";
        var p = Math.min(1, Math.abs(dx) / (width() * 0.3));
        $(".s-yes", top).style.opacity = dx > 0 ? p : 0;
        $(".s-no", top).style.opacity = dx < 0 ? p : 0;
        under.forEach(function (u) { u.style.setProperty("--lift", p); });
      }
      function springBack() {
        top.classList.add("settle");
        place(0, 0);
        setTimeout(function () { if (top) top.classList.remove("settle"); }, 260);
      }
      top.addEventListener("pointerdown", function (e) {
        if (busy || drag || (e.pointerType === "mouse" && e.button !== 0)) return;
        if (e.target.closest("button")) return;
        drag = { id: e.pointerId, x: e.clientX, y: e.clientY, dx: 0, dy: 0, moved: false, pts: [{ x: e.clientX, t: e.timeStamp }] };
        try { top.setPointerCapture(e.pointerId); } catch (err) { /* old browsers */ }
        top.classList.remove("settle");
      });
      top.addEventListener("pointermove", function (e) {
        if (!drag || e.pointerId !== drag.id) return;
        drag.dx = e.clientX - drag.x; drag.dy = e.clientY - drag.y;
        if (!drag.moved && Math.abs(drag.dx) + Math.abs(drag.dy) > 8) drag.moved = true;
        drag.pts.push({ x: e.clientX, t: e.timeStamp });
        if (drag.pts.length > 6) drag.pts.shift();
        if (drag.moved) { e.preventDefault(); place(drag.dx, drag.dy * 0.35); }
      });
      function release(e) {
        if (!drag || e.pointerId !== drag.id) return;
        var g = drag; drag = null;
        if (e.type !== "pointerup") { if (g.moved) springBack(); return; }
        if (!g.moved) { flip(); return; }
        var first = g.pts[0], last = g.pts[g.pts.length - 1];
        var v = last.t > first.t ? (last.x - first.x) / (last.t - first.t) : 0; // px per ms
        var far = Math.abs(g.dx) > width() * 0.3;
        var flick = Math.abs(v) > 0.45 && Math.abs(g.dx) > 30 && (v > 0) === (g.dx > 0);
        if (far || flick) fly(g.dx > 0, g.dx, g.dy * 0.35);
        else springBack();
      }
      top.addEventListener("pointerup", release);
      top.addEventListener("pointercancel", release);
      top.addEventListener("lostpointercapture", function (e) { if (drag && e.pointerId === drag.id) release({ type: "cancel", pointerId: e.pointerId }); });
      top.addEventListener("keydown", function (e) { if (e.key === "Enter" && e.target === top) { e.preventDefault(); flip(); } });
      // Long-press menus and text selection would break the drag on phones.
      top.addEventListener("contextmenu", function (e) { e.preventDefault(); });
      top.addEventListener("dragstart", function (e) { e.preventDefault(); });

      function flyOut(ok, dx, dy) {
        var dir = ok ? 1 : -1;
        var dist = Math.max(window.innerWidth, 400) + width();
        top.classList.add("gone");
        place(dx, dy);
        $(ok ? ".s-yes" : ".s-no", top).style.opacity = 1;
        under.forEach(function (u) { u.style.setProperty("--lift", 1); });
        // Force the current position, then animate off screen.
        void top.offsetWidth;
        top.style.transform = "translate(" + dir * dist + "px," + (dy + 60) + "px) rotate(" + dir * 28 + "deg)";
      }
      fly = function (ok, dx, dy) {
        if (busy || !top) return;
        busy = true; drag = null;
        flyOut(ok, dx, dy);
        setTimeout(function () { answer(ok); }, reduced() ? 60 : 280);
      };
    }
    var fly = function () {};

    function answer(ok) {
      var v = cur(); if (!v) return;
      history.push({ queue: round.queue.slice(), pos: round.pos, again: Object.assign({}, round.again), yes: round.yes, no: round.no, key: v.key, box: boxes[v.key] });
      if (history.length > 50) history.shift();
      if (ok) { boxes[v.key] = Math.min(5, (boxes[v.key] || 0) + 1); round.yes++; }
      else {
        boxes[v.key] = 0; round.no++;
        // A missed card comes back a few cards later in the same round (at most twice).
        var n = round.again[v.key] || 0;
        if (n < 2) { round.again[v.key] = n + 1; round.queue.splice(Math.min(round.pos + 4, round.queue.length), 0, v); }
      }
      round.pos++;
      store.set("fcBox", boxes);
      render();
    }
    function undo() {
      var h = history.pop(); if (!h) return;
      round.queue = h.queue; round.pos = h.pos; round.again = h.again; round.yes = h.yes; round.no = h.no;
      if (h.box === undefined) delete boxes[h.key]; else boxes[h.key] = h.box;
      store.set("fcBox", boxes);
      render();
      if (top) { top.classList.add("back-in"); }
    }

    function finished() {
      top = null;
      var k = known(d), n = d.cards.length;
      app.innerHTML = '<div class="study"><div class="s-screen">' +
        '<header class="s-top"><a class="icon-btn" href="#/" aria-label="Zurück zur Übersicht">' + ICON.back + '</a><div class="s-title">' + esc(title()) + '</div><div class="s-count"></div><span class="icon-btn-space"></span></header>' +
        '<div class="done"><div class="done-big">Runde fertig</div>' +
        '<div class="done-stats"><div><b class="t-good">' + round.yes + '</b><span>gewusst</span></div><div><b class="t-bad">' + round.no + "</b><span>nochmal</span></div></div>" +
        '<p>Im ganzen Stapel: <b>' + k + " von " + n + "</b> Karten gewusst.</p>" +
        '<div class="deck-bar wide"><span style="width:' + (n ? Math.round(k / n * 100) : 0) + '%"></span></div>' +
        '<div class="done-btns"><button class="btn primary" id="again">Nächste Runde</button>' +
        (history.length ? '<button class="btn" id="b-undo">Letzte Karte zurück</button>' : "") +
        '<a class="btn" href="#opts" id="to-opts">Anderer Stapel</a></div></div>' + optionsHtml() + "</div>";
      $("#again", app).addEventListener("click", newRound);
      wireOptions();
      var u = $("#b-undo", app); if (u) u.addEventListener("click", undo);
    }

    function onKey(e) {
      if (/input|select|textarea/i.test(e.target.tagName)) return;
      if (!top) return;
      if (e.key === " ") { e.preventDefault(); flip(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); fly(true, 0, 0); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); fly(false, 0, 0); }
      else if (e.key === "s" || e.key === "S") sayCur("w");
      else if (e.key === "z" || e.key === "Z" || e.key === "Backspace") undo();
    }
    document.addEventListener("keydown", onKey);
    cleanup = function () { document.removeEventListener("keydown", onKey); };
    newRound();
  }

  // Colour the article: der = blue, die = red, das = green (a common memory aid).
  function article(de, gram) {
    var m = String(de).match(/^(der|die|das)\s+(.*)$/);
    if (!m) return esc(de);
    // "die" without a plural note is often a plural-only word: leave it uncoloured.
    var g = m[1] === "der" ? "m" : m[1] === "das" ? "n" : (gram && /Pl\./.test(gram) ? "f" : "");
    return '<span class="art' + (g ? " art-" + g : "") + '">' + m[1] + "</span> " + esc(m[2]);
  }

  document.addEventListener("DOMContentLoaded", function () {
    app = $("#app");
    buildDecks();
    window.addEventListener("hashchange", route);
    route();
  });

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js", { scope: "./" }).catch(function () {}); });
  }
})();
