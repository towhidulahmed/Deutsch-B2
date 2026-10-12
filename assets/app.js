/* B2 Lernseite: renders every class registered with B2.addClass() (see classes/*.js). */
(function () {
  "use strict";

  var CLASSES = [];
  window.B2 = {
    addClass: function (c) { CLASSES.push(c); }
  };

  /* ---------- storage (fails quietly in private windows) ---------- */
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  };

  /* ---------- helpers ---------- */
  function $(sel, el) { return (el || document).querySelector(sel); }
  function $$(sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function stripTags(s) { var d = document.createElement("div"); d.innerHTML = s; return d.textContent || ""; }
  function byId(id) { for (var i = 0; i < CLASSES.length; i++) if (CLASSES[i].id === id) return CLASSES[i]; return null; }
  function sorted() { return CLASSES.slice().sort(function (a, b) { return a.nr - b.nr; }); }
  function classVocab(c) { return (c.vocab || []).map(function (v) { return Object.assign({ cls: c }, v); }); }
  function allVocab() { var out = []; sorted().forEach(function (c) { out = out.concat(classVocab(c)); }); return out; }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function cardKey(v) { return v.cls.id + "|" + v.de; }
  // Search ignores case and umlaut spelling (ü = u = ue).
  function fold(s) {
    return String(s || "").toLowerCase().replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u").replace(/ß/g, "ss")
      .replace(/ae/g, "a").replace(/oe/g, "o").replace(/ue/g, "u").replace(/\s+/g, " ").trim();
  }
  // Answers accept ae/oe/ue/ss for ä/ö/ü/ß, but not a bare u for ü.
  function answerKey(s) {
    return String(s || "").trim().toLowerCase().replace(/\s+/g, " ").replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss");
  }
  var inFrame = (function () { try { return window.self !== window.top; } catch (e) { return true; } })();
  var isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;

  var cleanups = [];
  function onCleanup(fn) { cleanups.push(fn); }
  function runCleanups() { cleanups.splice(0).forEach(function (fn) { fn(); }); }

  var ICON_SAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9h4l5-4v14l-5-4H4zM16 8.5a5 5 0 0 1 0 7l-1.4-1.4a3 3 0 0 0 0-4.2zM18.4 6a8.5 8.5 0 0 1 0 12L17 16.6a6.5 6.5 0 0 0 0-9.2z"/></svg>';
  function sayButton(text, label) {
    return '<button class="say" type="button" data-say="' + esc(text) + '" aria-label="' + esc(label || "Anhören") + '" title="Anhören">' + ICON_SAY + "</button>";
  }

  // Tables get labels per cell so they can stack on phones.
  function stackTables(root) {
    $$("table", root).forEach(function (t) {
      var heads = $$("thead th", t).map(function (th) { return th.textContent; });
      if (!heads.length) return;
      t.classList.add("stack");
      $$("tbody tr", t).forEach(function (tr) {
        $$("td", tr).forEach(function (td, i) { if (heads[i] && !td.hasAttribute("data-label")) td.setAttribute("data-label", heads[i]); });
      });
    });
  }

  /* ---------- pronunciation (device voices, works offline) ---------- */
  var speech = (function () {
    var synth = window.speechSynthesis;
    var voice = null;
    function pick() {
      if (!synth) return;
      var vs = synth.getVoices();
      if (!vs.length) return;
      var de = vs.filter(function (v) { return /^de([-_]|$)/i.test(v.lang); });
      de.sort(function (a, b) { return (/de[-_]DE/i.test(b.lang) ? 1 : 0) - (/de[-_]DE/i.test(a.lang) ? 1 : 0) || (b.localService ? 1 : 0) - (a.localService ? 1 : 0); });
      voice = de[0] || null;
      document.documentElement.classList.toggle("no-speech", !voice);
    }
    if (!synth || typeof window.SpeechSynthesisUtterance !== "function") {
      document.documentElement.classList.add("no-speech");
    } else {
      pick();
      if (synth.addEventListener) synth.addEventListener("voiceschanged", pick); else synth.onvoiceschanged = pick;
      // No voices at all after a while: hide the buttons (they come back if voices load later).
      setTimeout(function () { if (!synth.getVoices().length) document.documentElement.classList.add("no-speech"); }, 3000);
    }
    function clean(t) {
      return String(t).replace(/\([^)]*\)/g, "").replace(/\s*\/\s*/g, ", ").replace(/[+]\s*(Akk|Dat)\w*/g, "").replace(/\s+/g, " ").trim();
    }
    return {
      say: function (text) {
        if (!synth) return;
        synth.cancel();
        var u = new SpeechSynthesisUtterance(clean(text));
        u.lang = "de-DE"; if (voice) u.voice = voice; u.rate = 0.9;
        synth.speak(u);
      }
    };
  })();
  document.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest(".say[data-say]");
    if (!b) return;
    e.preventDefault(); e.stopPropagation();
    speech.say(b.getAttribute("data-say"));
  });

  /* ---------- theme ---------- */
  function currentDark() {
    var cur = document.documentElement.getAttribute("data-theme");
    return cur ? cur === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function syncThemeColor() {
    var color = currentDark() ? "#1a1f29" : "#ffffff";
    $$('meta[name="theme-color"]').forEach(function (m) { m.setAttribute("content", color); m.removeAttribute("media"); });
  }
  function initTheme() {
    var t = store.get("b2theme", null);
    if (t) { document.documentElement.setAttribute("data-theme", t); syncThemeColor(); }
    var btn = $("#theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var next = currentDark() ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      store.set("b2theme", next);
      syncThemeColor();
    });
  }

  /* ---------- install as app ---------- */
  var installEvent = null;
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault(); installEvent = e;
    var slot = $("#install-slot"); if (slot) renderInstall(slot);
  });
  function renderInstall(slot) {
    if (!slot) return;
    if (inFrame || isStandalone || store.get("b2installHidden", false)) { slot.innerHTML = ""; return; }
    var ua = navigator.userAgent;
    var ios = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    var text;
    if (installEvent) text = "Installiere die Lernseite als App. Sie startet dann vom Startbildschirm und funktioniert auch offline.";
    else if (ios) text = "Als App speichern: In Safari auf <b>Teilen</b> tippen, dann <b>Zum Home-Bildschirm</b>.";
    else { slot.innerHTML = ""; return; }
    slot.innerHTML = '<div class="install"><img src="assets/icons/icon-192.png" alt=""><p>' + text + '</p><div class="btn-row">' +
      (installEvent ? '<button class="btn primary" id="do-install">Installieren</button>' : "") +
      '<button class="btn" id="hide-install">Ausblenden</button></div></div>';
    var di = $("#do-install");
    if (di) di.addEventListener("click", function () {
      installEvent.prompt();
      installEvent.userChoice.finally(function () { installEvent = null; renderInstall(slot); });
    });
    $("#hide-install").addEventListener("click", function () { store.set("b2installHidden", true); slot.innerHTML = ""; });
  }

  /* ---------- progress ---------- */
  function cardsKnown(c) {
    var known = store.get("b2known", {});
    return (c.vocab || []).filter(function (v) { return known[c.id + "|" + v.de]; }).length;
  }
  function drillBest(c) {
    var best = null;
    (c.drills || []).forEach(function (d, di) { var b = store.get("b2drill:" + c.id + ":" + di, null); if (b && !best) best = b; });
    return best;
  }

  /* ---------- routing ---------- */
  var TABS = [
    ["ueberblick", "Überblick"],
    ["grammatik", "Grammatik"],
    ["wortschatz", "Wortschatz"],
    ["karten", "Karteikarten"],
    ["uebungen", "Übungen"],
    ["notizen", "Notizen"]
  ];
  function tabLabel(key) { for (var i = 0; i < TABS.length; i++) if (TABS[i][0] === key) return TABS[i][1]; return key; }

  function route() {
    runCleanups();
    var h = (location.hash || "").replace(/^#/, "");
    var app = $("#app");
    setNav(h);
    window.scrollTo(0, 0);
    if (!h || h === "start") return renderHome(app);
    if (h === "wortschatz") return renderAllVocab(app);
    if (h === "karteikarten") return renderAllCards(app);
    if (h === "notizen") return renderAllNotes(app);
    var parts = h.split("-");
    var c = byId(parts[0]);
    if (c) return renderClass(app, c, parts[1] || store.get("b2tab:" + c.id, "ueberblick"));
    renderHome(app);
  }
  function setNav(h) {
    var key = !h ? "start" : (byId(h.split("-")[0]) ? "start" : h);
    $$(".mainnav a").forEach(function (a) {
      if (a.getAttribute("href") === "#" + key) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    var titles = { wortschatz: "Wortschatz", karteikarten: "Karteikarten", notizen: "Notizen" };
    var c = h && byId(h.split("-")[0]);
    document.title = (c ? "Tag " + c.nr + ": " + c.title : titles[h] || "Deutsch B2 Lernseite") + (c || titles[h] ? " · Deutsch B2" : "");
  }

  /* ---------- home ---------- */
  function renderHome(app) {
    var cls = sorted();
    var vocab = allVocab();
    var known = store.get("b2known", {});
    var nKnown = vocab.filter(function (v) { return known[cardKey(v)]; }).length;
    var html = '<section class="hero"><span class="eyebrow">Deutsch · Niveau B2</span>' +
      "<h1>Alle Kurstage auf einen Blick</h1>" +
      '<p class="lede">Zusammenfassung, Grammatik, Wortschatz, Karteikarten und Übungen zu jedem Kurstag. Alle Beispiele stammen aus dem Unterricht. Deine Notizen bleiben auf deinem Gerät.</p>' +
      '<div class="stats"><div><strong>' + cls.length + "</strong>Tage</div><div><strong>" + vocab.length + "</strong>Wörter</div><div><strong>" + nKnown + "</strong>Karten gewusst</div></div></section>";
    html += '<div id="install-slot"></div>';
    html += '<section class="class-list" aria-label="Kurstage">';
    cls.slice().reverse().forEach(function (c) {
      var nv = (c.vocab || []).length, nk = cardsKnown(c), best = drillBest(c);
      html += '<a class="class-card" href="#' + esc(c.id) + '"><span class="class-no">Tag ' + c.nr + "</span><div><h3>" + esc(c.title) + '</h3><div class="meta">' + esc(c.date || "") + (c.topic ? " · " + esc(c.topic) : "") + "</div>" +
        '<div class="progress-line"><span class="pill' + (nv && nk === nv ? " done" : "") + '">Karten ' + nk + "/" + nv + "</span>" +
        (c.drills && c.drills.length ? '<span class="pill' + (best && best.score === best.total ? " done" : "") + '">Schnelltest ' + (best ? best.score + "/" + best.total : "offen") + "</span>" : "") +
        '</div></div><span class="go" aria-hidden="true">→</span></a>';
    });
    if (!cls.length) html += '<p class="muted">Noch keine Tage eingetragen.</p>';
    html += "</section>";
    app.innerHTML = html;
    renderInstall($("#install-slot"));
  }

  /* ---------- class page ---------- */
  function renderClass(app, c, tab) {
    if (!TABS.some(function (t) { return t[0] === tab; })) tab = "ueberblick";
    var html = '<header class="lesson-head"><a class="back" href="#start">← Alle Tage</a><span class="eyebrow">Tag ' + c.nr + (c.date ? " · " + esc(c.date) : "") + "</span><h1>" + esc(c.title) + "</h1>";
    if (c.tags && c.tags.length) html += '<div class="tags">' + c.tags.map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</div>";
    html += "</header>";
    html += '<div class="tabs-wrap"><nav class="tabs" role="tablist" aria-label="Bereiche des Tages">' + TABS.map(function (t) {
      return '<button role="tab" id="tab-' + t[0] + '" aria-controls="panel" aria-selected="' + (t[0] === tab) + '" tabindex="' + (t[0] === tab ? 0 : -1) + '" data-tab="' + t[0] + '">' + t[1] + "</button>";
    }).join("") + "</nav></div>";
    html += '<section class="panel" id="panel" role="tabpanel"><div class="panel-body" id="panel-body"></div><div class="next-row" id="next-row"></div></section>';
    app.innerHTML = html;
    var tabs = $$(".tabs button", app);
    tabs.forEach(function (b) {
      b.addEventListener("click", function () { switchTab(app, c, b.dataset.tab); });
    });
    $(".tabs", app).addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault(); e.stopPropagation();
      var idx = tabs.indexOf(document.activeElement);
      if (idx < 0) return;
      var n = tabs[(idx + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
      n.focus(); switchTab(app, c, n.dataset.tab);
    });
    var bar = $(".tabs", app);
    bar.addEventListener("scroll", function () { fadeEdges(bar); }, { passive: true });
    var active = $('.tabs [aria-selected="true"]', app);
    if (active && active.scrollIntoView) active.scrollIntoView({ block: "nearest", inline: "center" });
    fadeEdges(bar);
    drawPanel(app, c, tab);
  }
  function fadeEdges(bar) {
    bar.classList.toggle("fade-l", bar.scrollLeft > 4);
    bar.classList.toggle("fade-r", bar.scrollLeft + bar.clientWidth < bar.scrollWidth - 4);
  }
  window.addEventListener("resize", function () { var bar = $(".tabs"); if (bar) fadeEdges(bar); });
  function switchTab(app, c, tab, scroll) {
    runCleanups();
    history.replaceState(null, "", "#" + c.id + "-" + tab);
    store.set("b2tab:" + c.id, tab);
    $$(".tabs button", app).forEach(function (b) {
      var on = b.dataset.tab === tab;
      b.setAttribute("aria-selected", String(on)); b.tabIndex = on ? 0 : -1;
    });
    var active = $('.tabs [aria-selected="true"]', app);
    if (active && active.scrollIntoView) active.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    drawPanel(app, c, tab);
    var wrap = $(".tabs-wrap", app);
    var top = wrap.getBoundingClientRect().top + window.scrollY - (parseFloat(getComputedStyle(wrap).top) || 0);
    var phone = window.matchMedia && matchMedia("(max-width: 720px)").matches;
    if (scroll || phone || window.scrollY > top) window.scrollTo(0, top);
  }
  function drawPanel(app, c, tab) {
    var body = $("#panel-body"), next = $("#next-row");
    $("#panel").setAttribute("aria-labelledby", "tab-" + tab);
    ({ ueberblick: panelOverview, grammatik: panelGrammar, wortschatz: panelVocab, karten: panelCards, uebungen: panelExercises, notizen: panelNotes })[tab](body, c, app);
    var idx = TABS.map(function (t) { return t[0]; }).indexOf(tab);
    var nt = tab === "ueberblick" ? null : TABS[idx + 1]; // the overview has its own learning path
    next.innerHTML = nt ? '<button class="btn next-btn" type="button">Weiter: ' + nt[1] + " →</button>" : "";
    if (nt) $("button", next).addEventListener("click", function () { switchTab(app, c, nt[0], true); });
  }

  function panelOverview(p, c, app) {
    var nv = (c.vocab || []).length, nk = cardsKnown(c), best = drillBest(c);
    var nEx = (c.exercises || []).length, nDr = (c.drills || []).length;
    var html = '<div class="prose">' + (c.summary || "") + "</div>";
    if (c.keyPoints && c.keyPoints.length) {
      html += '<div class="block"><h2>Das Wichtigste</h2><div class="prose"><ul>' + c.keyPoints.map(function (k) { return "<li>" + k + "</li>"; }).join("") + "</ul></div></div>";
    }
    if (c.homework) html += '<div class="callout"><strong>Hausaufgabe:</strong> ' + c.homework + "</div>";
    var steps = [];
    if (c.grammar && c.grammar.length) steps.push(["grammatik", "Grammatik lesen", c.grammar.length + " Themen"]);
    if (nv) steps.push(["karten", "Wörter mit Karteikarten lernen", nk + " von " + nv + " gewusst"]);
    if (nDr || nEx) steps.push(["uebungen", "Üben", [nDr ? "Schnelltest" + (best ? " " + best.score + "/" + best.total : "") : "", nEx ? nEx + " Übung" + (nEx > 1 ? "en" : "") : ""].filter(Boolean).join(" · ")]);
    steps.push(["notizen", "Eigene Notizen schreiben", "Fragen, eigene Beispielsätze"]);
    html += '<div class="block"><h2>So lernst du diesen Tag</h2><ol class="path">' + steps.map(function (s, i) {
      return '<li><button type="button" data-go="' + s[0] + '"><span class="step">' + (i + 1) + '</span><span class="path-text"><b>' + s[1] + '</b><span class="muted">' + esc(s[2]) + '</span></span><span class="go" aria-hidden="true">→</span></button></li>';
    }).join("") + "</ol></div>";
    p.innerHTML = html;
    $$("[data-go]", p).forEach(function (b) { b.addEventListener("click", function () { switchTab(app, c, b.dataset.go, true); }); });
  }

  function panelGrammar(p, c) {
    if (!c.grammar || !c.grammar.length) { p.innerHTML = '<p class="muted">Keine Grammatik an diesem Tag.</p>'; return; }
    var toc = c.grammar.length > 2 ? '<nav class="toc" aria-label="Themen">' + c.grammar.map(function (g, i) {
      return '<button type="button" class="chip" data-sec="' + i + '">' + esc(g.title) + "</button>";
    }).join("") + "</nav>" : "";
    p.innerHTML = toc + c.grammar.map(function (g, i) { return '<article class="block" id="sec-' + i + '"><h2>' + esc(g.title) + "</h2>" + g.html + "</article>"; }).join("");
    stackTables(p);
    $$("[data-sec]", p).forEach(function (b) {
      b.addEventListener("click", function () { $("#sec-" + b.dataset.sec).scrollIntoView({ behavior: "smooth", block: "start" }); });
    });
  }

  function vocabTable(list, showClass) {
    if (!list.length) return '<p class="muted">Keine Treffer. Versuch ein anderes Wort.</p>';
    return '<div class="table-wrap"><table class="stack"><thead><tr><th>Deutsch</th><th>Bedeutung</th><th>Beispiel aus dem Unterricht</th>' + (showClass ? "<th>Tag</th>" : "") + "</tr></thead><tbody>" +
      list.map(function (v) {
        return '<tr><td><span class="word-cell">' + sayButton(v.de + (v.ex ? ". " + v.ex : ""), v.de + " anhören") + '<span><span class="de">' + esc(v.de) + "</span>" + (v.gram ? ' <span class="gram">' + esc(v.gram) + "</span>" : "") + "</span></span></td>" +
          '<td data-label="Bedeutung">' + esc(v.en) + "</td>" +
          '<td class="ex-cell" data-label="Beispiel">' + esc(v.ex || "") + "</td>" +
          (showClass ? '<td data-label="Tag"><a href="#' + v.cls.id + '-wortschatz">Tag ' + v.cls.nr + "</a></td>" : "") + "</tr>";
      }).join("") + "</tbody></table></div>";
  }
  function filterVocab(list, q) {
    q = fold(q);
    if (!q) return list;
    return list.filter(function (v) { return fold(v.de + " " + v.en + " " + (v.ex || "") + " " + (v.gram || "")).indexOf(q) !== -1; });
  }
  function vocabUI(p, list, showClass) {
    p.innerHTML = '<div class="toolbar"><input type="search" id="vq" placeholder="Wort oder Bedeutung suchen …" aria-label="Wort suchen" enterkeyhint="search" autocomplete="off"><span class="muted" id="vcount"></span></div><div id="vt"></div>';
    var draw = function () {
      var res = filterVocab(list, $("#vq").value);
      $("#vt").innerHTML = vocabTable(res, showClass);
      $("#vcount").textContent = res.length + " von " + list.length;
    };
    $("#vq").addEventListener("input", draw);
    $("#vq").addEventListener("keydown", function (e) { if (e.key === "Enter") e.target.blur(); });
    draw();
  }
  function panelVocab(p, c) { vocabUI(p, classVocab(c), false); }

  /* ---------- flashcards ---------- */
  function cardsUI(p, list, title) {
    var known = store.get("b2known", {});
    var mode = "alle";
    var deck = [], again = {}, i = 0, flipped = false, reverse = store.get("b2reverse", false);

    function build() {
      deck = shuffle(list.filter(function (v) { return mode === "alle" || !known[cardKey(v)]; }));
      again = {}; i = 0; flipped = false; draw();
    }
    function answer(ok) {
      var v = deck[i];
      if (!v) return;
      var k = cardKey(v);
      if (ok) known[k] = 1;
      else {
        delete known[k];
        // Missed cards come back later in the same round (at most twice).
        if ((again[k] || 0) < 2) { again[k] = (again[k] || 0) + 1; deck.push(v); }
      }
      store.set("b2known", known); i++; flipped = false; draw();
    }
    function flip() {
      var fc = $("#fc", p); if (!fc) return;
      flipped = !flipped; fc.classList.toggle("flipped", flipped);
    }
    function draw() {
      var nKnown = list.filter(function (v) { return known[cardKey(v)]; }).length;
      var settings = '<div class="toolbar fc-settings">' +
        '<select id="fc-mode" aria-label="Welche Karten"><option value="alle"' + (mode === "alle" ? " selected" : "") + '>Alle Karten</option><option value="offen"' + (mode === "offen" ? " selected" : "") + ">Nur noch nicht gewusst</option></select>" +
        '<label class="check"><input type="checkbox" id="fc-rev"' + (reverse ? " checked" : "") + "> Bedeutung zuerst</label>" +
        '<span class="muted">' + nKnown + " / " + list.length + " gewusst</span></div>";
      var html = "";
      if (!deck.length) {
        html += '<div class="fc-wrap"><div class="callout">' + (list.length ? "Alle Karten gewusst. Wähle unten „Alle Karten“, um sie noch einmal zu üben." : "Keine Karten vorhanden.") + "</div>" + settings + "</div>";
      } else if (i >= deck.length) {
        var missed = Object.keys(again).length;
        html += '<div class="fc-wrap"><div class="callout">Runde fertig! ' + nKnown + " von " + list.length + " Karten gewusst." + (missed ? " " + missed + " Karte" + (missed > 1 ? "n kamen" : " kam") + " noch einmal dran." : "") + '</div><div class="btn-row"><button class="btn primary" id="fc-again">Neue Runde</button>' +
          (nKnown < list.length ? '<button class="btn" id="fc-open">Nur offene Karten</button>' : "") + "</div>" + settings + "</div>";
      } else {
        var v = deck[i];
        var de = '<div class="fc-word">' + esc(v.de) + "</div>" + (v.gram ? '<div class="fc-sub">' + esc(v.gram) + "</div>" : "");
        var en = '<div class="fc-word meaning">' + esc(v.en) + "</div>";
        var front = reverse ? en : de;
        var back = (reverse ? de : en) + (v.ex ? '<div class="fc-ex">' + esc(v.ex) + "</div>" : "");
        var repeat = again[cardKey(v)] && deck.indexOf(v) < i;
        html += '<div class="fc-wrap"><div class="fc-top"><span class="fc-progress">Karte ' + (i + 1) + " / " + deck.length + (title ? " · " + esc(title(v)) : "") + (repeat ? ' · <span class="again">noch einmal</span>' : "") + "</span>" +
          '<button class="say" type="button" id="fc-say" aria-label="Anhören" title="Anhören">' + ICON_SAY + "</button></div>" +
          '<div class="fc-bar"><span style="width:' + Math.round(i / deck.length * 100) + '%"></span></div>' +
          '<button class="flashcard" id="fc" aria-label="Karte umdrehen"><div class="fc-inner"><div class="fc-face">' + front + '<div class="fc-hint">Tippen zum Umdrehen · wischen zum Bewerten</div></div><div class="fc-face fc-back">' + back + "</div></div></button>" +
          '<div class="fc-actions"><button class="btn bad" id="fc-no">Noch nicht</button><button class="btn" id="fc-flip">Umdrehen</button><button class="btn good" id="fc-yes">Gewusst</button></div>' +
          '<div class="fc-keys">Tastatur: Leertaste = umdrehen · ← noch nicht · → gewusst</div>' + settings + "</div>";
      }
      p.innerHTML = html;
      $("#fc-mode", p).addEventListener("change", function (e) { mode = e.target.value; build(); });
      $("#fc-rev", p).addEventListener("change", function (e) { reverse = e.target.checked; store.set("b2reverse", reverse); flipped = false; draw(); });
      var againBtn = $("#fc-again", p); if (againBtn) againBtn.addEventListener("click", function () { mode = "alle"; build(); });
      var openBtn = $("#fc-open", p); if (openBtn) openBtn.addEventListener("click", function () { mode = "offen"; build(); });
      var fc = $("#fc", p);
      if (fc) {
        var cur = deck[i];
        $("#fc-say", p).addEventListener("click", function () { speech.say(cur.de + (flipped && cur.ex ? ". " + cur.ex : "")); });
        $("#fc-flip", p).addEventListener("click", flip);
        $("#fc-yes", p).addEventListener("click", function () { answer(true); });
        $("#fc-no", p).addEventListener("click", function () { answer(false); });
        // Swipe: right = gewusst, left = noch nicht. A short tap flips.
        var sx = 0, sy = 0, dx = 0, moving = false;
        fc.addEventListener("pointerdown", function (e) { sx = e.clientX; sy = e.clientY; dx = 0; moving = true; });
        fc.addEventListener("pointermove", function (e) {
          if (!moving) return;
          dx = e.clientX - sx;
          if (Math.abs(dx) > Math.abs(e.clientY - sy) && Math.abs(dx) > 10) {
            fc.style.transform = "translateX(" + dx + "px) rotate(" + dx / 30 + "deg)";
            fc.classList.toggle("swipe-right", dx > 60); fc.classList.toggle("swipe-left", dx < -60);
          }
        });
        var end = function () {
          if (!moving) return; moving = false;
          fc.style.transform = ""; fc.classList.remove("swipe-right", "swipe-left");
          if (dx > 80) answer(true); else if (dx < -80) answer(false); else if (Math.abs(dx) < 8) flip();
        };
        fc.addEventListener("pointerup", end);
        fc.addEventListener("pointercancel", function () { moving = false; fc.style.transform = ""; fc.classList.remove("swipe-right", "swipe-left"); });
        fc.addEventListener("click", function (e) { if (e.detail === 0) flip(); }); // keyboard activation only
      }
    }
    function onKey(e) {
      if (/input|select|textarea/i.test(e.target.tagName)) return;
      if (e.target.closest && e.target.closest(".tabs")) return;
      if (e.target.tagName === "BUTTON" && (e.key === " " || e.key === "Enter")) return;
      if (e.key === " ") { e.preventDefault(); flip(); }
      else if (e.key === "ArrowRight") answer(true);
      else if (e.key === "ArrowLeft") answer(false);
    }
    document.addEventListener("keydown", onKey);
    onCleanup(function () { document.removeEventListener("keydown", onKey); });
    build();
  }
  function panelCards(p, c) { cardsUI(p, classVocab(c)); }

  /* ---------- quick quiz (tap the right option) ---------- */
  function drillUI(box, c, d, di) {
    var key = "b2drill:" + c.id + ":" + di;
    var queue, pos, firstTry, missed, answered, timer;
    function answers(it) { return [].concat(it.a); }
    function start() {
      queue = shuffle(d.items.map(function (it) { return { it: it, retry: false }; }));
      pos = 0; firstTry = 0; missed = []; answered = false; draw();
    }
    function draw() {
      clearTimeout(timer);
      var best = store.get(key, null);
      var head = '<h2>' + esc(d.title) + "</h2>" + (d.intro ? '<p class="muted">' + esc(d.intro) + "</p>" : "");
      if (pos >= queue.length) {
        var total = d.items.length;
        var isBest = !best || firstTry > best.score;
        if (isBest) { best = { score: firstTry, total: total }; store.set(key, best); }
        box.innerHTML = head + '<div class="drill-done"><p class="drill-score"><strong>' + firstTry + " / " + total + "</strong> beim ersten Versuch richtig" + (isBest ? " · neuer Bestwert" : " · Bestwert " + best.score + "/" + best.total) + "</p>" +
          (missed.length ? '<p class="muted">Diese solltest du wiederholen:</p><ul class="missed">' + missed.map(function (it) {
            return "<li><b>" + esc(it.q) + "</b>" + (it.hint ? " (" + esc(it.hint) + ")" : "") + " → " + esc(answers(it).join(" / ")) + '<span class="ex-mini">' + it.ex + "</span></li>";
          }).join("") + "</ul>" : '<p class="muted">Alles richtig. Sehr gut!</p>') +
          '<div class="btn-row start"><button class="btn primary" data-act="restart">Noch einmal</button></div></div>';
        return;
      }
      var q = queue[pos];
      box.innerHTML = head +
        '<div class="drill-top"><span class="fc-progress">Frage ' + (pos + 1) + " / " + queue.length + (q.retry ? ' · <span class="again">noch einmal</span>' : "") + "</span>" +
        (best ? '<span class="fc-progress">Bestwert ' + best.score + "/" + best.total + "</span>" : "") + "</div>" +
        '<div class="fc-bar wide"><span style="width:' + Math.round(pos / queue.length * 100) + '%"></span></div>' +
        '<div class="drill-q"><span class="drill-word">' + esc(q.it.q) + ' <span class="blank">___</span></span>' + (q.it.hint ? '<span class="drill-hint">' + esc(q.it.hint) + "</span>" : "") + "</div>" +
        '<div class="opts" role="group" aria-label="Antworten">' + d.options.map(function (o, oi) {
          return '<button class="opt" type="button" data-opt="' + esc(o) + '"><kbd>' + ((oi + 1) % 10) + "</kbd>" + esc(o) + "</button>";
        }).join("") + "</div>" +
        '<div class="drill-fb" aria-live="polite"></div>';
      answered = false;
    }
    function choose(opt) {
      if (answered || pos >= queue.length) return;
      answered = true;
      var q = queue[pos], right = answers(q.it), ok = right.indexOf(opt) !== -1;
      $$(".opt", box).forEach(function (b) {
        var o = b.getAttribute("data-opt");
        b.disabled = true;
        if (right.indexOf(o) !== -1) b.classList.add("is-right");
        else if (o === opt) b.classList.add("is-wrong");
      });
      if (ok && !q.retry) firstTry++;
      if (!ok && !q.retry) { missed.push(q.it); queue.push({ it: q.it, retry: true }); }
      $(".drill-fb", box).innerHTML = '<div class="fb ' + (ok ? "good" : "bad") + '"><strong>' + (ok ? "Richtig!" : "Richtig ist: " + esc(right.join(" / "))) + "</strong>" +
        '<p class="ex">' + q.it.ex + " " + sayButton(stripTags(q.it.ex), "Beispiel anhören") + "</p></div>" +
        (ok ? "" : '<div class="btn-row start"><button class="btn primary" data-act="next">Weiter</button></div>');
      var fb = $(".drill-fb", box);
      if (getComputedStyle(fb).position === "fixed") {
        // Phones: the feedback is a sheet above the tab bar. Keep the question visible above it.
        var tabs = $(".tabs-wrap"), nav = $(".mainnav"), qr = $(".drill-q", box).getBoundingClientRect();
        var minTop = tabs ? tabs.getBoundingClientRect().bottom : 0;
        var maxBottom = (nav ? nav.getBoundingClientRect().top : window.innerHeight) - fb.offsetHeight;
        if (qr.top < minTop || qr.bottom > maxBottom) $(".drill-top", box).scrollIntoView({ block: "start", behavior: "smooth" });
      } else if (!ok && fb.scrollIntoView) {
        fb.scrollIntoView({ block: "nearest", behavior: "smooth" }); // bring the Weiter button into view
      }
      if (ok) timer = setTimeout(next, 1400);
      else { var nb = $('[data-act="next"]', box); if (nb) nb.focus({ preventScroll: true }); }
    }
    function next() {
      clearTimeout(timer); pos++; draw();
      // The question moved up under the sticky tabs while the feedback was shown: bring it back.
      var top = $(".drill-top", box) || box, tabs = $(".tabs-wrap");
      var limit = tabs ? tabs.getBoundingClientRect().bottom : 0;
      if (top.getBoundingClientRect().top < limit && top.scrollIntoView) top.scrollIntoView({ block: "start", behavior: "smooth" });
    }
    box.addEventListener("click", function (e) {
      var o = e.target.closest(".opt"); if (o) return choose(o.getAttribute("data-opt"));
      var a = e.target.closest("[data-act]"); if (!a) return;
      if (a.dataset.act === "next") next();
      if (a.dataset.act === "restart") start();
    });
    function onKey(e) {
      if (/input|select|textarea/i.test(e.target.tagName)) return;
      var r = box.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return; // only when the quiz is on screen
      if (/^[0-9]$/.test(e.key)) {
        var idx = e.key === "0" ? 9 : Number(e.key) - 1;
        if (d.options[idx]) { e.preventDefault(); choose(d.options[idx]); }
      } else if (e.key === "Enter" && answered && document.activeElement && !document.activeElement.closest(".say")) {
        e.preventDefault(); next();
      }
    }
    document.addEventListener("keydown", onKey);
    onCleanup(function () { clearTimeout(timer); document.removeEventListener("keydown", onKey); });
    if ("IntersectionObserver" in window) {
      // Hide the feedback sheet while the quiz is scrolled out of view.
      var io = new IntersectionObserver(function (en) { box.classList.toggle("away", !en[0].isIntersecting); }, { rootMargin: "-120px 0px -120px 0px" });
      io.observe(box);
      onCleanup(function () { io.disconnect(); });
    }
    start();
  }

  /* ---------- gap exercises ---------- */
  // Item text marks gaps as [[answer]]; alternatives with "|"; "-" means: nothing goes here.
  function gapRight(g) {
    var v = answerKey(g.value), pre = g.dataset.pre || "";
    return g.dataset.ans.split("|").some(function (a) {
      if (a === "-") return v === "" || v === "-" || v === "x" || v === "—" || v === "–" || (pre && v === answerKey(pre));
      return answerKey(a) === v || (pre && answerKey(pre + a) === v);
    });
  }
  function panelExercises(p, c) {
    var hasDrills = c.drills && c.drills.length, hasEx = c.exercises && c.exercises.length;
    if (!hasDrills && !hasEx) { p.innerHTML = '<p class="muted">Keine Übungen an diesem Tag.</p>'; return; }
    var html = (c.drills || []).map(function (d, di) { return '<article class="block drill" data-drill="' + di + '"></article>'; }).join("");
    html += (c.exercises || []).map(function (ex, ei) {
      var items = ex.items.map(function (it, ii) {
        var gi = 0;
        var text = esc(it.q).replace(/\[\[(.*?)\]\]/g, function (m, ans, offset, str) {
          var longest = Math.max.apply(null, ans.split("|").map(function (a) { return a.length; }));
          var short = longest <= 3;
          var id = "g-" + ei + "-" + ii + "-" + (gi++);
          // Letters right before the gap (d___, sein___): typing the whole word counts too.
          var pre = (str.slice(0, offset).match(/[A-Za-zÄÖÜäöüß]+$/) || [""])[0];
          return '<input type="text" class="gap' + (short ? " short" : "") + '" id="' + id + '" data-ans="' + esc(ans) + '" data-pre="' + esc(pre) + '"' + (longest > 9 ? ' style="width:' + (longest + 2) + 'ch"' : "") + ' autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="next" aria-label="Lücke">';
        });
        return "<li>" + text + (it.note ? ' <span class="ex-note" hidden>(' + esc(it.note) + ")</span>" : "") + "</li>";
      }).join("");
      return '<article class="block exercise" data-ex="' + ei + '"><h2>' + esc(ex.title) + "</h2>" + (ex.intro ? '<p class="muted">' + esc(ex.intro) + "</p>" : "") +
        '<ol class="ex-items">' + items + '</ol><div class="ex-actions"><button class="btn primary" data-act="check">Prüfen</button><button class="btn" data-act="show">Lösung</button><button class="btn" data-act="reset">Leeren</button><span class="ex-score" aria-live="polite"></span></div></article>';
    }).join("");
    p.innerHTML = html;
    $$(".drill", p).forEach(function (box) { var di = Number(box.dataset.drill); drillUI(box, c, c.drills[di], di); });

    var allGaps = $$(".gap", p);
    allGaps.forEach(function (g, idx) {
      g.addEventListener("keydown", function (e) {
        if (e.key === "Enter") { e.preventDefault(); var n = allGaps[idx + 1]; if (n) n.focus(); else g.blur(); }
      });
    });
    $$(".exercise", p).forEach(function (box) {
      var key = "b2ex:" + c.id + ":" + box.dataset.ex;
      var saved = store.get(key, {});
      var resetArmed = null;
      var gaps = $$(".gap", box);
      var score = $(".ex-score", box);
      function clearHints() {
        $$(".sol", box).forEach(function (s) { s.remove(); });
        gaps.forEach(function (g) { g.placeholder = ""; g.classList.remove("hinted"); });
      }
      gaps.forEach(function (g) {
        if (saved[g.id]) g.value = saved[g.id];
        g.addEventListener("input", function () {
          saved[g.id] = g.value; store.set(key, saved);
          g.classList.remove("ok", "no", "hinted"); g.placeholder = "";
          var s = g.nextElementSibling; if (s && s.classList.contains("sol")) s.remove();
        });
      });
      var filledItems = $$(".ex-items > li", box).filter(function (li) { return $$(".gap", li).some(function (g) { return g.value.trim(); }); }).length;
      if (filledItems) score.textContent = filledItems + " / " + box.querySelectorAll(".ex-items > li").length + " Sätze bearbeitet";
      box.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-act]"); if (!btn) return;
        var act = btn.dataset.act;
        if (act === "reset") {
          if (!resetArmed) {
            btn.textContent = "Wirklich leeren?"; btn.classList.add("danger");
            resetArmed = setTimeout(function () { btn.textContent = "Leeren"; btn.classList.remove("danger"); resetArmed = null; }, 3000);
            return;
          }
          clearTimeout(resetArmed); resetArmed = null; btn.textContent = "Leeren"; btn.classList.remove("danger");
          gaps.forEach(function (g) { g.value = ""; g.classList.remove("ok", "no"); });
          clearHints();
          $$(".ex-note", box).forEach(function (n) { n.hidden = true; });
          saved = {}; store.set(key, saved);
          score.textContent = "";
          return;
        }
        clearHints();
        var ok = 0, tried = 0, open = 0, firstWrong = null;
        $$(".ex-items > li", box).forEach(function (li) {
          var lg = $$(".gap", li);
          var attempted = lg.some(function (g) { return g.value.trim() !== ""; });
          lg.forEach(function (g) {
            var good = gapRight(g);
            g.classList.remove("ok", "no");
            if (attempted) {
              g.classList.add(good ? "ok" : "no");
              tried++; if (good) ok++; else if (!firstWrong) firstWrong = g;
            }
            if (act === "show" && !good) {
              var a = g.dataset.ans.split("|")[0];
              a = a === "-" ? "—" : a;
              // Empty gap: the answer appears inside it. Wrong answer: it appears next to it.
              if (g.value.trim()) g.insertAdjacentHTML("afterend", '<span class="sol">' + esc(a) + "</span>");
              else { g.placeholder = a; g.classList.add("hinted"); }
            }
          });
          if (!attempted) open++;
          var note = $(".ex-note", li);
          if (note && (act === "show" || attempted)) note.hidden = false;
        });
        score.textContent = tried ? ok + " / " + tried + " richtig" + (open ? " · " + open + " Sätze offen" : "") : "Noch nichts eingetragen";
        if (act === "check" && firstWrong) firstWrong.scrollIntoView({ block: "center", behavior: "smooth" });
      });
    });
  }

  /* ---------- notes ---------- */
  function panelNotes(p, c) {
    var key = "b2note:" + c.id;
    p.innerHTML = '<div class="block"><h2>Meine Notizen zu Tag ' + c.nr + '</h2><p class="muted">Wird automatisch auf diesem Gerät gespeichert. Andere sehen deine Notizen nicht.</p>' +
      '<textarea class="notes-box" id="note-' + esc(c.id) + '" placeholder="Eigene Beispielsätze, Fragen an die Lehrkraft, Eselsbrücken …"></textarea><span class="saved" id="saved" aria-live="polite"></span></div>';
    var ta = $(".notes-box", p), t;
    ta.value = store.get(key, "");
    var save = function () { $("#saved").textContent = store.set(key, ta.value) ? "Gespeichert" : "Speichern auf diesem Gerät nicht möglich"; };
    ta.addEventListener("input", function () { clearTimeout(t); $("#saved").textContent = "…"; t = setTimeout(save, 400); });
    ta.addEventListener("blur", function () { clearTimeout(t); save(); });
  }

  /* ---------- global pages ---------- */
  function renderAllVocab(app) {
    app.innerHTML = '<header class="lesson-head"><span class="eyebrow">Alle Tage</span><h1>Wortschatz</h1></header><section class="panel" id="panel"></section>';
    vocabUI($("#panel"), allVocab(), true);
  }
  function renderAllCards(app) {
    app.innerHTML = '<header class="lesson-head"><span class="eyebrow">Alle Tage gemischt</span><h1>Karteikarten</h1></header><section class="panel" id="panel"></section>';
    cardsUI($("#panel"), allVocab(), function (v) { return "Tag " + v.cls.nr; });
  }

  function backupData() {
    var data = {};
    try { for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (/^b2/.test(k)) data[k] = localStorage.getItem(k); } } catch (e) {}
    return { app: "deutsch-b2", version: 1, saved: new Date().toISOString(), data: data };
  }
  function renderAllNotes(app) {
    var cls = sorted();
    var html = '<header class="lesson-head"><span class="eyebrow">Nur auf deinem Gerät</span><h1>Meine Notizen</h1></header>';
    var any = false, text = "";
    cls.forEach(function (c) {
      var n = (store.get("b2note:" + c.id, "") || "").trim();
      if (!n) return;
      any = true;
      text += "Tag " + c.nr + ": " + c.title + "\n" + n + "\n\n";
      html += '<article class="block note-item"><h2><a href="#' + c.id + '-notizen">Tag ' + c.nr + ": " + esc(c.title) + "</a></h2><pre>" + esc(n) + "</pre></article>";
    });
    if (!any) {
      html += '<div class="callout">Noch keine Notizen. Öffne einen Tag und schreib im Tab „Notizen“.</div>';
      html += '<div class="class-list">' + cls.map(function (c) { return '<a class="class-card" href="#' + c.id + '-notizen"><span class="class-no">Tag ' + c.nr + "</span><div><h3>" + esc(c.title) + '</h3></div><span class="go" aria-hidden="true">→</span></a>'; }).join("") + "</div>";
    } else {
      html += '<div class="toolbar">' + (navigator.share ? '<button class="btn primary" id="share-notes">Teilen</button>' : "") +
        '<button class="btn' + (navigator.share ? "" : " primary") + '" id="copy-notes">Kopieren</button>' +
        '<span class="saved" id="copied" aria-live="polite"></span></div>';
    }
    html += '<section class="block"><h2>Lernstand sichern</h2><p class="muted">Notizen, Karteikarten und Übungen werden nur auf diesem Gerät gespeichert. Safari und die installierte App speichern getrennt. Mit einer Sicherungsdatei nimmst du alles auf ein anderes Gerät oder in die App mit.</p>' +
      '<div class="toolbar"><button class="btn" id="backup">Sicherung speichern</button><label class="btn" for="restore-file">Sicherung laden</label><input type="file" id="restore-file" class="sr-only" accept="application/json,.json"><span class="saved" id="backup-msg" aria-live="polite"></span></div></section>';
    app.innerHTML = html;

    var msg = function (t) { $("#backup-msg").textContent = t; };
    $("#backup").addEventListener("click", function () {
      var json = JSON.stringify(backupData());
      var name = "deutsch-b2-sicherung-" + new Date().toISOString().slice(0, 10) + ".json";
      var file = null;
      try { file = new File([json], name, { type: "application/json" }); } catch (e) {}
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: "Deutsch B2 Sicherung" }).then(function () { msg("Gespeichert"); }, function () {});
        return;
      }
      var a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([json], { type: "application/json" }));
      a.download = name; document.body.appendChild(a); a.click(); a.remove();
      msg("Datei gespeichert");
    });
    $("#restore-file").addEventListener("change", function (e) {
      var f = e.target.files && e.target.files[0]; if (!f) return;
      var r = new FileReader();
      r.onload = function () {
        try {
          var obj = JSON.parse(r.result);
          if (!obj || obj.app !== "deutsch-b2" || !obj.data) throw new Error("bad");
          var n = 0;
          Object.keys(obj.data).forEach(function (k) { if (/^b2/.test(k)) { localStorage.setItem(k, obj.data[k]); n++; } });
          renderAllNotes(app);
          $("#backup-msg").textContent = "Wiederhergestellt (" + n + " Einträge)";
        } catch (err) { msg("Das ist keine Sicherung dieser Lernseite."); }
      };
      r.readAsText(f);
    });

    if (!any) return;
    var done = function (m) { $("#copied").textContent = m; };
    var sh = $("#share-notes");
    if (sh) sh.addEventListener("click", function () { navigator.share({ title: "Meine B2-Notizen", text: text }).catch(function () {}); });
    $("#copy-notes").addEventListener("click", function () {
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { done("Kopiert"); }, function () { done("Kopieren nicht möglich. Bitte Text markieren und kopieren."); });
      else done("Kopieren nicht möglich. Bitte Text markieren und kopieren.");
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    window.addEventListener("hashchange", route);
    route();
    if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol) && !inFrame) {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    }
  });
})();
