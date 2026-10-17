/* B2 Lernseite: renders every class registered with B2.addClass() (see classes/*.js). */
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
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }
  };

  /* ---------- helpers ---------- */
  function $(sel, el) { return (el || document).querySelector(sel); }
  function $$(sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function stripTags(s) { var d = document.createElement("div"); d.innerHTML = s; return d.textContent || ""; }
  function byId(id) { for (var i = 0; i < CLASSES.length; i++) if (CLASSES[i].id === id) return CLASSES[i]; return null; }
  function sorted() { return CLASSES.slice().sort(function (a, b) { return a.nr - b.nr; }); }
  function classVocab(c) { return (c.vocab || []).concat(WORDS[c.id] || []).map(function (v) { return Object.assign({ cls: c }, v); }); }
  var LEVELS = ["A1", "A2", "B1"];
  function allVocab() { var out = []; sorted().forEach(function (c) { out = out.concat(classVocab(c)); }); return out; }
  // Flashcards = vocabulary + grammar form cards (c.cards, only in Karten, not in Wortschatz).
  function classPhrases(c) {
    var out = [];
    (c.dialogues || []).forEach(function (d) { (d.phrases || []).forEach(function (ph) { out.push({ cls: c, phrase: true, de: ph.de, en: ph.en, ex: d.title }); }); });
    return out;
  }
  function classCards(c) { return classVocab(c).concat((c.cards || []).map(function (v) { return Object.assign({ cls: c, form: true }, v); }), classPhrases(c)); }
  function allCards() { var out = []; sorted().forEach(function (c) { out = out.concat(classCards(c)); }); return out; }
  // One day picker for every page: the chosen day is remembered (b2day).
  function curDay() { var d = store.get("b2day", "alle"); return d !== "alle" && !byId(d) ? "alle" : d; }
  function dayBar(active, withAll) {
    var cls = sorted();
    var chip = function (id, label, title) {
      return '<button type="button" class="chip day-chip" data-day="' + esc(id) + '" aria-pressed="' + (id === active) + '"' + (title ? ' title="' + esc(title) + '"' : "") + ">" + esc(label) + "</button>";
    };
    return '<nav class="daybar" aria-label="Tag wählen">' + (withAll ? chip("alle", "Alle Tage") : "") +
      cls.map(function (c) { return chip(c.id, "Tag " + c.nr, c.title); }).join("") + "</nav>";
  }
  function wireDays(app, pick) {
    $$("[data-day]", app).forEach(function (b) {
      b.addEventListener("click", function () { store.set("b2day", b.dataset.day); pick(b.dataset.day); });
    });
    var on = $('.daybar [aria-pressed="true"]', app);
    if (on && on.scrollIntoView) on.scrollIntoView({ block: "nearest", inline: "center" });
  }
  function dayHead(kicker, title, d) {
    var c = d !== "alle" && byId(d);
    return '<header class="lesson-head"><span class="eyebrow">' + (c ? "Tag " + c.nr : kicker) + "</span><h1>" + title + "</h1>" + dayBar(d, true) + "</header>";
  }
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
      // Conjugation grids (class "forms") stay real tables: rows = persons, columns = verbs.
      if (!heads.length || t.classList.contains("forms")) return;
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
    // Light is the default; dark only after the person picks it.
    document.documentElement.setAttribute("data-theme", store.get("b2theme", "light") === "dark" ? "dark" : "light");
    syncThemeColor();
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
    return classCards(c).filter(function (v) { return known[cardKey(v)]; }).length;
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
    ["uebungen", "Übungen"]
  ];
  // Wortschatz, Karten and Gespräche live in the main navigation only (with the day picker).
  // (notizen: the old notes page, now redirected to Gespräche)
  var TOOLS = { wortschatz: "wortschatz", karten: "karteikarten", gespraeche: "gespraeche", notizen: "gespraeche" };
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
    if (h === "gespraeche") return renderDialogues(app);
    if (h === "notizen") { location.replace("#gespraeche"); return; }
    var parts = h.split("-");
    var c = byId(parts[0]);
    if (c && TOOLS[parts[1]]) { store.set("b2day", c.id); location.replace("#" + TOOLS[parts[1]]); return; }
    if (c) return renderClass(app, c, parts[1] || store.get("b2tab:" + c.id, "ueberblick"));
    renderHome(app);
  }
  function setNav(h) {
    var key = !h ? "start" : (byId(h.split("-")[0]) ? "start" : h);
    $$(".mainnav a").forEach(function (a) {
      if (a.getAttribute("href") === "#" + key) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    var titles = { wortschatz: "Wortschatz", karteikarten: "Karteikarten", gespraeche: "Gespräche" };
    var c = h && byId(h.split("-")[0]);
    document.title = (c ? "Tag " + c.nr + ": " + c.title : titles[h] || "Deutsch B2 Lernseite") + (c || titles[h] ? " · Deutsch B2" : "");
  }

  /* ---------- home ---------- */
  function renderHome(app) {
    var cls = sorted();
    var vocab = allVocab();
    var known = store.get("b2known", {});
    var nKnown = allCards().filter(function (v) { return known[cardKey(v)]; }).length;
    var html = '<section class="hero"><span class="eyebrow">Deutsch · Niveau B2</span>' +
      "<h1>Alle Kurstage auf einen Blick</h1>" +
      '<p class="lede">Zusammenfassung, Grammatik, Wortschatz, Karteikarten und Übungen zu jedem Kurstag. Die Beispiele stammen aus dem Unterricht, Tag 0 wiederholt die Grundlagen. Zu jedem Tag gibt es Gespräche aus dem Alltag zum Auswendiglernen.</p>' +
      '<div class="stats"><div><strong>' + cls.length + "</strong>Tage</div><div><strong>" + vocab.length + "</strong>Wörter</div><div><strong>" + nKnown + "</strong>Karten gewusst</div></div></section>";
    html += '<div id="install-slot"></div>';
    html += '<section class="class-list" aria-label="Kurstage">';
    cls.slice().reverse().forEach(function (c) {
      var nv = classCards(c).length, nk = cardsKnown(c), best = drillBest(c);
      html += '<a class="class-card" href="#' + esc(c.id) + '"><span class="class-no">Tag ' + c.nr + "</span><div><h3>" + esc(c.title) + '</h3><div class="meta">' + esc(c.date || "") + (c.topic ? " · " + esc(c.topic) : "") + "</div>" +
        '<div class="progress-line"><span class="pill' + (nv && nk === nv ? " done" : "") + '">Karten ' + nk + "/" + nv + "</span>" +
        (c.drills && c.drills.length ? '<span class="pill' + (best && best.score === best.total ? " done" : "") + '">Schnelltest ' + (best ? best.score + "/" + best.total : "offen") + "</span>" : "") +
        '</div></div><span class="go" aria-hidden="true">→</span></a>';
    });
    if (!cls.length) html += '<p class="muted">Noch keine Tage eingetragen.</p>';
    html += "</section>";
    html += '<div id="backup-slot"></div>';
    app.innerHTML = html;
    renderInstall($("#install-slot"));
    renderBackup($("#backup-slot"), function () { renderHome(app); });
  }

  /* ---------- class page ---------- */
  function renderClass(app, c, tab) {
    if (!TABS.some(function (t) { return t[0] === tab; })) tab = "ueberblick";
    store.set("b2day", c.id);
    var html = '<header class="lesson-head">' + (sorted().length > 1 ? dayBar(c.id, false) : '<a class="back" href="#start">← Alle Tage</a>') + '<span class="eyebrow">Tag ' + c.nr + (c.date ? " · " + esc(c.date) : "") + "</span><h1>" + esc(c.title) + "</h1>";
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
    $$("[data-day]", app).forEach(function (b) {
      b.addEventListener("click", function () {
        var cur = $('.tabs [aria-selected="true"]', app);
        location.hash = "#" + b.dataset.day + "-" + (cur ? cur.dataset.tab : "ueberblick"); // same section, other day
      });
    });
    var onDay = $('.daybar [aria-pressed="true"]', app);
    if (onDay && onDay.scrollIntoView) onDay.scrollIntoView({ block: "nearest", inline: "center" });
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
    ({ ueberblick: panelOverview, grammatik: panelGrammar, wortschatz: panelVocab, karten: panelCards, uebungen: panelExercises })[tab](body, c, app);
    var idx = TABS.map(function (t) { return t[0]; }).indexOf(tab);
    var nt = tab === "ueberblick" ? null : TABS[idx + 1]; // the overview has its own learning path
    next.innerHTML = nt ? '<button class="btn next-btn" type="button">Weiter: ' + nt[1] + " →</button>" : "";
    if (nt) $("button", next).addEventListener("click", function () { switchTab(app, c, nt[0], true); });
  }

  function panelOverview(p, c, app) {
    var nv = classCards(c).length, nk = cardsKnown(c), best = drillBest(c);
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
    var nDl = (c.dialogues || []).length;
    if (nDl) steps.push(["gespraeche", "Gespräche lesen und auswendig lernen", nDl + " Gespräch" + (nDl > 1 ? "e" : "") + " aus dem Alltag"]);
    html += '<div class="block"><h2>So lernst du diesen Tag</h2><ol class="path">' + steps.map(function (s, i) {
      return '<li><button type="button" data-go="' + s[0] + '"><span class="step">' + (i + 1) + '</span><span class="path-text"><b>' + s[1] + '</b><span class="muted">' + esc(s[2]) + '</span></span><span class="go" aria-hidden="true">→</span></button></li>';
    }).join("") + "</ol></div>";
    p.innerHTML = html;
    $$("[data-go]", p).forEach(function (b) { b.addEventListener("click", function () {
      if (TOOLS[b.dataset.go]) location.hash = "#" + c.id + "-" + b.dataset.go; else switchTab(app, c, b.dataset.go, true);
    }); });
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
    return '<div class="table-wrap"><table class="stack"><thead><tr><th>Deutsch</th><th>Bedeutung</th><th>Beispiel</th>' + (showClass ? "<th>Tag</th>" : "") + "</tr></thead><tbody>" +
      list.map(function (v) {
        return '<tr><td><span class="word-cell">' + sayButton(v.de + (v.ex ? ". " + v.ex : ""), v.de + " anhören") + '<span><span class="de">' + esc(v.de) + "</span>" + (v.lvl ? ' <span class="lvl">' + esc(v.lvl) + "</span>" : "") + (v.gram ? ' <span class="gram">' + esc(v.gram) + "</span>" : "") + "</span></span></td>" +
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
    // Long lists (the A1–B1 word list) get a level and topic filter and are shown in pages.
    var hasLvl = list.some(function (v) { return v.lvl; });
    var lvl = hasLvl ? store.get("b2lvl", "alle") : "alle";
    if (lvl !== "alle" && lvl !== "tag" && LEVELS.indexOf(lvl) < 0) lvl = "alle";
    var topics = [];
    list.forEach(function (v) { if (v.t && topics.indexOf(v.t) < 0) topics.push(v.t); });
    topics.sort(function (a, b) { return a.localeCompare(b, "de"); });
    var PAGE = 150, shown = PAGE;
    var levelBar = !hasLvl ? "" : '<div class="seg lvl-bar" role="group" aria-label="Niveau">' +
      [["alle", "Alle"], ["A1", "A1"], ["A2", "A2"], ["B1", "B1"], ["tag", "Wörter der Tage"]].map(function (o) {
        return '<button type="button" class="chip" data-lvl="' + o[0] + '" aria-pressed="' + (lvl === o[0]) + '">' + o[1] + "</button>";
      }).join("") + "</div>";
    var topicSel = !topics.length ? "" : '<select id="vtopic" aria-label="Thema"><option value="">Alle Themen</option>' +
      topics.map(function (t) { return '<option value="' + esc(t) + '">' + esc(t) + "</option>"; }).join("") + "</select>";
    p.innerHTML = levelBar + '<div class="toolbar"><input type="search" id="vq" placeholder="Wort oder Bedeutung suchen …" aria-label="Wort suchen" enterkeyhint="search" autocomplete="off">' + topicSel + '<span class="muted" id="vcount"></span></div><div id="vt"></div>';
    var draw = function () {
      var topic = topicSel ? $("#vtopic", p).value : "";
      var base = list.filter(function (v) {
        if (lvl === "tag" ? v.lvl : lvl !== "alle" && v.lvl !== lvl) return false;
        return !topic || v.t === topic;
      });
      var res = filterVocab(base, $("#vq", p).value);
      $("#vt", p).innerHTML = vocabTable(res.slice(0, shown), showClass) +
        (res.length > shown ? '<div class="btn-row more-row"><button class="btn" id="vmore">Mehr anzeigen (' + (res.length - shown) + " weitere)</button></div>" : "");
      $("#vcount", p).textContent = res.length + " von " + base.length;
      var more = $("#vmore", p); if (more) more.addEventListener("click", function () { shown += PAGE * 2; draw(); });
    };
    var reset = function () { shown = PAGE; draw(); };
    $$("[data-lvl]", p).forEach(function (b) {
      b.addEventListener("click", function () {
        lvl = b.dataset.lvl; store.set("b2lvl", lvl);
        $$("[data-lvl]", p).forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
        reset();
      });
    });
    if (topicSel) $("#vtopic", p).addEventListener("change", reset);
    $("#vq", p).addEventListener("input", reset);
    $("#vq", p).addEventListener("keydown", function (e) { if (e.key === "Enter") e.target.blur(); });
    draw();
  }
  function panelVocab(p, c) { vocabUI(p, classVocab(c), false); }

  /* ---------- flashcards ---------- */
  function cardsUI(p, full, title) {
    var known = store.get("b2known", {});
    // Deck: words, grammar forms, or both (only offered when there are form cards).
    var kindOf = function (v) { return v.form ? "formen" : v.phrase ? "saetze" : v.lvl ? v.lvl : "woerter"; };
    var kinds = ["woerter", "A1", "A2", "B1", "formen", "saetze"].filter(function (k) { return full.some(function (v) { return kindOf(v) === k; }); });
    var hasForms = kinds.length > 1;
    var kind = store.get("b2deck", "alle");
    if (kind !== "alle" && kinds.indexOf(kind) < 0) kind = "alle";
    var list;
    function pick() { list = full.filter(function (v) { return kind === "alle" || kindOf(v) === kind; }); }
    pick();
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
        (hasForms ? '<select id="fc-kind" aria-label="Welcher Stapel"><option value="alle"' + (kind === "alle" ? " selected" : "") + ">Alle Karten</option>" +
          [["woerter", kinds.indexOf("A1") >= 0 ? "Nur Wörter der Tage" : "Nur Wörter"], ["A1", "Wortliste A1"], ["A2", "Wortliste A2"], ["B1", "Wortliste B1"], ["formen", "Nur Grammatik-Formen"], ["saetze", "Nur Sätze aus den Gesprächen"]].filter(function (o) { return kinds.indexOf(o[0]) >= 0; }).map(function (o) {
            return '<option value="' + o[0] + '"' + (kind === o[0] ? " selected" : "") + ">" + o[1] + "</option>";
          }).join("") + "</select>" : "") +
        '<select id="fc-mode" aria-label="Welche Karten"><option value="alle"' + (mode === "alle" ? " selected" : "") + '>Alle</option><option value="offen"' + (mode === "offen" ? " selected" : "") + ">Nur noch nicht gewusst</option></select>" +
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
      var kindSel = $("#fc-kind", p); if (kindSel) kindSel.addEventListener("change", function (e) { kind = e.target.value; store.set("b2deck", kind); pick(); build(); });
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
        // Touch uses touch events with an axis lock: once the finger moves sideways the page
        // is not allowed to scroll, so the browser can no longer cancel the swipe halfway.
        // A quick flick counts too, not only a long drag.
        var sx = 0, sy = 0, dx = 0, dy = 0, axis = "", active = false, trail = [];
        var setDrag = function () {
          fc.style.transform = "translateX(" + dx + "px) rotate(" + dx / 30 + "deg)";
          fc.classList.toggle("swipe-right", dx > 60); fc.classList.toggle("swipe-left", dx < -60);
        };
        var reset = function () {
          active = false; fc.classList.remove("dragging", "swipe-right", "swipe-left"); fc.style.transform = "";
        };
        var start = function (x, y) { sx = x; sy = y; dx = 0; dy = 0; axis = ""; active = true; trail = [[Date.now(), x]]; };
        var move = function (x, y) {
          if (!active) return false;
          dx = x - sx; dy = y - sy;
          trail.push([Date.now(), x]); if (trail.length > 6) trail.shift();
          if (!axis && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) axis = Math.abs(dx) >= Math.abs(dy) * 0.8 ? "x" : "y";
          if (axis !== "x") return false;
          fc.classList.add("dragging"); setDrag();
          return true;
        };
        var finish = function () {
          if (!active) return;
          var wasAxis = axis, d = dx, first = trail[0], last = trail[trail.length - 1];
          var speed = Math.abs(last[1] - first[1]) / Math.max(16, last[0] - first[0]);  // px/ms over the last moves
          reset();
          if (!wasAxis) { flip(); return; }
          // A swipe that began a little vertical still counts when it ends clearly sideways.
          var sideways = wasAxis === "x" || Math.abs(d) > Math.abs(dy) * 1.5;
          var far = Math.abs(d) > Math.min(90, fc.offsetWidth * 0.25), flick = Math.abs(d) > 40 && speed > 0.3;
          if (sideways && (far || flick)) answer(d > 0);
        };
        fc.addEventListener("touchstart", function (e) {
          if (e.touches.length > 1) { reset(); return; }
          start(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: true });
        fc.addEventListener("touchmove", function (e) {
          if (e.touches.length > 1) { reset(); return; }
          if (move(e.touches[0].clientX, e.touches[0].clientY) && e.cancelable) e.preventDefault();
        }, { passive: false });
        fc.addEventListener("touchend", function (e) { if (active && e.cancelable) e.preventDefault(); finish(); });
        fc.addEventListener("touchcancel", reset);
        // Mouse and pen: the same gesture with pointer events (touch is handled above).
        fc.addEventListener("pointerdown", function (e) {
          if (e.pointerType === "touch" || e.button !== 0) return;
          start(e.clientX, e.clientY);
          try { fc.setPointerCapture(e.pointerId); } catch (err) {}
        });
        fc.addEventListener("pointermove", function (e) { if (e.pointerType !== "touch") move(e.clientX, e.clientY); });
        fc.addEventListener("pointerup", function (e) { if (e.pointerType !== "touch") finish(); });
        fc.addEventListener("pointercancel", function (e) { if (e.pointerType !== "touch") reset(); });
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
  function panelCards(p, c) { cardsUI(p, classCards(c)); }

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
        '<div class="drill-q"><span class="drill-word">' + esc(q.it.q) + (d.blank === false ? "" : ' <span class="blank">___</span>') + "</span>" + (q.it.hint ? '<span class="drill-hint">' + esc(q.it.hint) + "</span>" : "") + "</div>" +
        '<div class="opts' + (d.options.length <= 4 ? " few" : "") + '" role="group" aria-label="Antworten">' + d.options.map(function (o, oi) {
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

  /* ---------- global pages ---------- */
  function renderAllVocab(app) {
    var d = curDay();
    app.innerHTML = dayHead("Alle Tage", "Wortschatz", d) + '<section class="panel" id="panel"></section>';
    wireDays(app, function () { runCleanups(); renderAllVocab(app); });
    vocabUI($("#panel"), allVocab().filter(function (v) { return d === "alle" || v.cls.id === d; }), d === "alle");
  }
  function renderAllCards(app) {
    var d = curDay();
    app.innerHTML = dayHead("Alle Tage gemischt", "Karteikarten", d) + '<section class="panel" id="panel"></section>';
    wireDays(app, function () { runCleanups(); renderAllCards(app); });
    cardsUI($("#panel"), allCards().filter(function (v) { return d === "alle" || v.cls.id === d; }), d === "alle" ? function (v) { return "Tag " + v.cls.nr; } : null);
  }

  function backupData() {
    var data = {};
    try { for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (/^b2/.test(k)) data[k] = localStorage.getItem(k); } } catch (e) {}
    return { app: "deutsch-b2", version: 1, saved: new Date().toISOString(), data: data };
  }
  /* ---------- backup (on Home) ---------- */
  function renderBackup(slot, rerender) {
    if (!slot) return;
    slot.innerHTML = '<section class="block"><h2>Lernstand sichern</h2><p class="muted">Karteikarten, Schnelltests und Übungen werden nur auf diesem Gerät gespeichert. Safari und die installierte App speichern getrennt. Mit einer Sicherungsdatei nimmst du alles auf ein anderes Gerät oder in die App mit.</p>' +
      '<div class="toolbar"><button class="btn" id="backup">Sicherung speichern</button><label class="btn" for="restore-file">Sicherung laden</label><input type="file" id="restore-file" class="sr-only" accept="application/json,.json"><span class="saved" id="backup-msg" aria-live="polite"></span></div></section>';
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
          rerender();
          $("#backup-msg").textContent = "Wiederhergestellt (" + n + " Einträge)";
        } catch (err) { msg("Das ist keine Sicherung dieser Lernseite."); }
      };
      r.readAsText(f);
    });
  }

  /* ---------- Gespräche (dialogues to read and memorise) ---------- */
  function renderDialogues(app) {
    var d = curDay();
    var cls = sorted().filter(function (c) { return (d === "alle" || c.id === d) && c.dialogues && c.dialogues.length; });
    var showEn = store.get("b2dlgEn", true), role = store.get("b2dlgRole", "keine");
    var html = dayHead("Alltag", "Gespräche", d) +
      '<section class="panel" id="panel"><div class="block dlg-controls">' +
      '<p class="muted">Lies die Gespräche laut, lerne die Sätze auswendig und übe dann eine Rolle: Ihre Sätze werden versteckt, tippe darauf, um sie zu sehen.</p>' +
      '<div class="toolbar"><label class="check"><input type="checkbox" id="dlg-en"' + (showEn ? " checked" : "") + "> Englisch zeigen</label>" +
      '<div class="seg" role="group" aria-label="Rolle üben">' +
      [["keine", "Alles lesen"], ["1", "Rolle 1 üben"], ["2", "Rolle 2 üben"]].map(function (o) {
        return '<button type="button" class="chip" data-role="' + o[0] + '" aria-pressed="' + (role === o[0]) + '">' + o[1] + "</button>";
      }).join("") + "</div></div></div>";
    if (!cls.length) html += '<p class="muted">Für diesen Tag gibt es noch keine Gespräche.</p>';
    cls.forEach(function (c) {
      if (d === "alle") html += '<h2 class="dlg-day">Tag ' + c.nr + ": " + esc(c.title) + "</h2>";
      c.dialogues.forEach(function (g, gi) {
        var speakers = [];
        g.lines.forEach(function (l) { if (speakers.indexOf(l.s) < 0) speakers.push(l.s); });
        html += '<article class="block dlg" data-dlg="' + c.id + "-" + gi + '"><h2>' + esc(g.title) + "</h2>" +
          (g.situation ? '<p class="muted dlg-sit">' + esc(g.situation) + "</p>" : "") +
          '<p class="dlg-roles">Rolle 1: <b>' + esc(speakers[0] || "") + "</b>" + (speakers[1] ? " · Rolle 2: <b>" + esc(speakers[1]) + "</b>" : "") + "</p>" +
          '<ol class="dlg-lines">' + g.lines.map(function (l) {
            var r = speakers.indexOf(l.s) + 1;
            return '<li class="dlg-line r' + r + '" data-r="' + r + '"><span class="dlg-who">' + esc(l.s) + "</span>" +
              '<div class="dlg-text"><button type="button" class="dlg-de" aria-label="Satz zeigen">' + esc(l.de) + "</button>" +
              '<span class="dlg-en">' + esc(l.en) + "</span></div>" +
              '<button class="say" type="button" data-say="' + esc(l.de) + '" aria-label="Anhören" title="Anhören">' + ICON_SAY + "</button></li>";
          }).join("") + "</ol>" +
          (g.phrases && g.phrases.length ? '<div class="dlg-phrases"><h3>Wichtige Sätze</h3><ul>' + g.phrases.map(function (ph) {
            return '<li><b>' + esc(ph.de) + '</b><span class="dlg-en">' + esc(ph.en) + "</span></li>";
          }).join("") + "</ul></div>" : "") + "</article>";
      });
    });
    if (cls.length) html += '<p class="muted dlg-tip">Tipp: Die wichtigen Sätze gibt es auch als Karteikarten (Karten → „Nur Sätze aus den Gesprächen“).</p>';
    html += "</section>";
    app.innerHTML = html;
    wireDays(app, function () { runCleanups(); renderDialogues(app); });
    var panel = $("#panel");
    var apply = function () {
      panel.classList.toggle("hide-en", !showEn);
      panel.setAttribute("data-role", role);
      $$(".dlg-line", panel).forEach(function (li) { li.classList.remove("shown"); });
      $$("[data-role]", panel).forEach(function (b) { if (b.tagName === "BUTTON") b.setAttribute("aria-pressed", String(b.dataset.role === role)); });
    };
    $("#dlg-en").addEventListener("change", function (e) { showEn = e.target.checked; store.set("b2dlgEn", showEn); apply(); });
    $$("button[data-role]", panel).forEach(function (b) { b.addEventListener("click", function () { role = b.dataset.role; store.set("b2dlgRole", role); apply(); }); });
    $$(".dlg-de", panel).forEach(function (b) { b.addEventListener("click", function () { b.closest(".dlg-line").classList.toggle("shown"); }); });
    apply();
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
