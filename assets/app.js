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
  function byId(id) { for (var i = 0; i < CLASSES.length; i++) if (CLASSES[i].id === id) return CLASSES[i]; return null; }
  function sorted() { return CLASSES.slice().sort(function (a, b) { return a.nr - b.nr; }); }
  function allVocab() {
    var out = [];
    sorted().forEach(function (c) { (c.vocab || []).forEach(function (v) { out.push(Object.assign({ cls: c }, v)); }); });
    return out;
  }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function cardKey(v) { return v.cls.id + "|" + v.de; }
  function normalize(s) { return String(s || "").trim().toLowerCase().replace(/\s+/g, " "); }
  var isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;

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
    if (isStandalone || store.get("b2installHidden", false)) { slot.innerHTML = ""; return; }
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

  /* ---------- routing ---------- */
  var TABS = [
    ["ueberblick", "Überblick"],
    ["grammatik", "Grammatik"],
    ["wortschatz", "Wortschatz"],
    ["karten", "Karteikarten"],
    ["uebungen", "Übungen"],
    ["notizen", "Notizen"]
  ];

  var cleanup = null; // per-page listeners (e.g. keyboard shortcuts)
  function route() {
    if (cleanup) { cleanup(); cleanup = null; }
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
    document.title = (c ? "Stunde " + c.nr + ": " + c.title : titles[h] || "Deutsch B2 Lernseite") + (c || titles[h] ? " · Deutsch B2" : "");
  }

  /* ---------- home ---------- */
  function renderHome(app) {
    var cls = sorted();
    var nVocab = allVocab().length;
    var known = store.get("b2known", {});
    var nKnown = Object.keys(known).length;
    var html = '<section class="hero"><span class="eyebrow">Deutsch · Niveau B2</span>' +
      "<h1>Alle Unterrichtsstunden auf einen Blick</h1>" +
      '<p class="lede">Zusammenfassung, Grammatik, Wortschatz, Karteikarten und Übungen zu jeder Stunde. Alle Beispiele stammen aus dem Unterricht. Deine Notizen bleiben auf deinem Gerät.</p>' +
      '<div class="stats"><div><strong>' + cls.length + "</strong>Stunden</div><div><strong>" + nVocab + "</strong>Wörter</div><div><strong>" + Math.min(nKnown, nVocab) + "</strong>Karten gewusst</div></div></section>";
    html += '<div id="install-slot"></div>';
    html += '<section class="class-list" aria-label="Stunden">';
    cls.slice().reverse().forEach(function (c) {
      html += '<a class="class-card" href="#' + esc(c.id) + '"><span class="class-no">Stunde ' + c.nr + "</span><div><h3>" + esc(c.title) + '</h3><div class="meta">' + esc(c.date || "") + (c.topic ? " · " + esc(c.topic) : "") + '</div></div><span class="go" aria-hidden="true">→</span></a>';
    });
    if (!cls.length) html += '<p class="muted">Noch keine Stunden eingetragen.</p>';
    html += "</section>";
    app.innerHTML = html;
    renderInstall($("#install-slot"));
  }

  /* ---------- class page ---------- */
  function renderClass(app, c, tab) {
    if (!TABS.some(function (t) { return t[0] === tab; })) tab = "ueberblick";
    var html = '<header class="lesson-head"><a class="back" href="#start">← Alle Stunden</a><span class="eyebrow">Stunde ' + c.nr + (c.date ? " · " + esc(c.date) : "") + "</span><h1>" + esc(c.title) + "</h1>";
    if (c.tags && c.tags.length) html += '<div class="tags">' + c.tags.map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</div>";
    html += "</header>";
    html += '<div class="tabs-wrap"><nav class="tabs" role="tablist" aria-label="Bereiche der Stunde">' + TABS.map(function (t) {
      return '<button role="tab" id="tab-' + t[0] + '" aria-selected="' + (t[0] === tab) + '" data-tab="' + t[0] + '">' + t[1] + "</button>";
    }).join("") + "</nav></div>";
    html += '<section class="panel" id="panel" role="tabpanel"></section>';
    app.innerHTML = html;
    $$(".tabs button", app).forEach(function (b) {
      b.addEventListener("click", function () { switchTab(app, c, b.dataset.tab); });
    });
    var active = $('.tabs [aria-selected="true"]', app);
    if (active && active.scrollIntoView) active.scrollIntoView({ block: "nearest", inline: "center" });
    drawPanel(c, tab);
  }
  function switchTab(app, c, tab) {
    if (cleanup) { cleanup(); cleanup = null; }
    history.replaceState(null, "", "#" + c.id + "-" + tab);
    store.set("b2tab:" + c.id, tab);
    $$(".tabs button", app).forEach(function (b) { b.setAttribute("aria-selected", String(b.dataset.tab === tab)); });
    var active = $('.tabs [aria-selected="true"]', app);
    if (active && active.scrollIntoView) active.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    drawPanel(c, tab);
    var wrap = $(".tabs-wrap", app);
    var top = wrap.getBoundingClientRect().top + window.scrollY - (parseFloat(getComputedStyle(wrap).top) || 0);
    if (window.scrollY > top) window.scrollTo(0, top);
  }
  function drawPanel(c, tab) {
    var p = $("#panel");
    ({ ueberblick: panelOverview, grammatik: panelGrammar, wortschatz: panelVocab, karten: panelCards, uebungen: panelExercises, notizen: panelNotes })[tab](p, c);
  }

  function panelOverview(p, c) {
    var html = '<div class="prose">' + (c.summary || "") + "</div>";
    if (c.keyPoints && c.keyPoints.length) {
      html += '<div class="block"><h2>Das Wichtigste</h2><div class="prose"><ul>' + c.keyPoints.map(function (k) { return "<li>" + k + "</li>"; }).join("") + "</ul></div></div>";
    }
    if (c.homework) html += '<div class="callout"><strong>Hausaufgabe:</strong> ' + c.homework + "</div>";
    p.innerHTML = html;
  }

  function panelGrammar(p, c) {
    if (!c.grammar || !c.grammar.length) { p.innerHTML = '<p class="muted">Keine Grammatik in dieser Stunde.</p>'; return; }
    p.innerHTML = c.grammar.map(function (g) { return '<article class="block"><h2>' + esc(g.title) + "</h2>" + g.html + "</article>"; }).join("");
    stackTables(p);
  }

  function vocabTable(list, showClass) {
    if (!list.length) return '<p class="muted">Keine Treffer.</p>';
    return '<div class="table-wrap"><table class="stack"><thead><tr><th>Deutsch</th><th>Bedeutung</th><th>Beispiel aus dem Unterricht</th>' + (showClass ? "<th>Stunde</th>" : "") + "</tr></thead><tbody>" +
      list.map(function (v) {
        return '<tr><td><span class="de">' + esc(v.de) + "</span>" + (v.gram ? ' <span class="muted" style="font-size:.82rem">' + esc(v.gram) + "</span>" : "") + '</td><td data-label="Bedeutung">' + esc(v.en) + '</td><td class="ex-cell" data-label="Beispiel">' + esc(v.ex || "") + "</td>" +
          (showClass ? '<td data-label="Stunde"><a href="#' + v.cls.id + '-wortschatz">Stunde ' + v.cls.nr + "</a></td>" : "") + "</tr>";
      }).join("") + "</tbody></table></div>";
  }
  function filterVocab(list, q) {
    q = normalize(q);
    if (!q) return list;
    return list.filter(function (v) { return normalize(v.de + " " + v.en + " " + (v.ex || "") + " " + (v.gram || "")).indexOf(q) !== -1; });
  }
  function vocabUI(p, list, showClass) {
    p.insertAdjacentHTML("beforeend", '<div class="toolbar"><input type="search" id="vq" placeholder="Wort oder Bedeutung suchen …" aria-label="Wort suchen" enterkeyhint="search" autocomplete="off"><span class="muted" id="vcount"></span></div><div id="vt"></div>');
    var draw = function () {
      var res = filterVocab(list, $("#vq").value);
      $("#vt").innerHTML = vocabTable(res, showClass);
      $("#vcount").textContent = res.length + " von " + list.length;
    };
    $("#vq").addEventListener("input", draw);
    $("#vq").addEventListener("keydown", function (e) { if (e.key === "Enter") e.target.blur(); });
    draw();
  }
  function panelVocab(p, c) {
    p.innerHTML = "";
    vocabUI(p, (c.vocab || []).map(function (v) { return Object.assign({ cls: c }, v); }), false);
  }

  /* ---------- flashcards ---------- */
  function cardsUI(p, list, title) {
    var known = store.get("b2known", {});
    var mode = "alle";
    var deck = [], i = 0, flipped = false, reverse = store.get("b2reverse", false);

    function build() {
      deck = list.filter(function (v) { return mode === "alle" || !known[cardKey(v)]; });
      shuffle(deck); i = 0; flipped = false; draw();
    }
    function answer(ok) {
      if (!deck[i]) return;
      if (ok) known[cardKey(deck[i])] = 1; else delete known[cardKey(deck[i])];
      store.set("b2known", known); i++; flipped = false; draw();
    }
    function flip() {
      var fc = $("#fc"); if (!fc) return;
      flipped = !flipped; fc.classList.toggle("flipped", flipped);
    }
    function draw() {
      var nKnown = list.filter(function (v) { return known[cardKey(v)]; }).length;
      var html = '<div class="toolbar">' +
        '<select id="fc-mode" aria-label="Welche Karten"><option value="alle"' + (mode === "alle" ? " selected" : "") + '>Alle Karten</option><option value="offen"' + (mode === "offen" ? " selected" : "") + ">Nur noch nicht gewusst</option></select>" +
        '<label class="check"><input type="checkbox" id="fc-rev"' + (reverse ? " checked" : "") + "> Bedeutung zuerst</label>" +
        '<span class="muted">' + nKnown + " / " + list.length + " gewusst</span></div>";
      if (!deck.length) {
        html += '<div class="callout">' + (list.length ? "Alle Karten gewusst. Wähle „Alle Karten“, um sie noch einmal zu üben." : "Keine Karten vorhanden.") + "</div>";
      } else if (i >= deck.length) {
        html += '<div class="fc-wrap"><div class="callout">Runde fertig! ' + nKnown + " von " + list.length + ' Karten gewusst.</div><div class="btn-row"><button class="btn primary" id="fc-again">Neue Runde</button></div></div>';
      } else {
        var v = deck[i];
        var de = '<div class="fc-word">' + esc(v.de) + "</div>" + (v.gram ? '<div class="fc-sub">' + esc(v.gram) + "</div>" : "");
        var en = '<div class="fc-word meaning">' + esc(v.en) + "</div>";
        var front = reverse ? en : de;
        var back = (reverse ? de : en) + (v.ex ? '<div class="fc-ex">' + esc(v.ex) + "</div>" : "");
        html += '<div class="fc-wrap"><div class="fc-progress">Karte ' + (i + 1) + " / " + deck.length + (title ? " · " + esc(title(v)) : "") + "</div>" +
          '<div class="fc-bar"><span style="width:' + Math.round(i / deck.length * 100) + '%"></span></div>' +
          '<button class="flashcard" id="fc" aria-label="Karte umdrehen"><div class="fc-inner"><div class="fc-face">' + front + '<div class="fc-hint">Tippen zum Umdrehen · wischen zum Bewerten</div></div><div class="fc-face fc-back">' + back + "</div></div></button>" +
          '<div class="fc-actions"><button class="btn bad" id="fc-no">Noch nicht</button><button class="btn" id="fc-flip">Umdrehen</button><button class="btn good" id="fc-yes">Gewusst</button></div>' +
          '<div class="fc-keys">Tastatur: Leertaste = umdrehen · ← noch nicht · → gewusst</div></div>';
      }
      p.innerHTML = html;
      $("#fc-mode").addEventListener("change", function (e) { mode = e.target.value; build(); });
      $("#fc-rev").addEventListener("change", function (e) { reverse = e.target.checked; store.set("b2reverse", reverse); flipped = false; draw(); });
      var again = $("#fc-again"); if (again) again.addEventListener("click", build);
      var fc = $("#fc");
      if (fc) {
        $("#fc-flip").addEventListener("click", flip);
        $("#fc-yes").addEventListener("click", function () { answer(true); });
        $("#fc-no").addEventListener("click", function () { answer(false); });
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
      if (e.target.tagName === "BUTTON" && (e.key === " " || e.key === "Enter")) return;
      if (e.key === " ") { e.preventDefault(); flip(); }
      else if (e.key === "ArrowRight") answer(true);
      else if (e.key === "ArrowLeft") answer(false);
    }
    document.addEventListener("keydown", onKey);
    cleanup = function () { document.removeEventListener("keydown", onKey); };
    build();
  }
  function panelCards(p, c) { cardsUI(p, (c.vocab || []).map(function (v) { return Object.assign({ cls: c }, v); })); }

  /* ---------- exercises ---------- */
  // Item text marks gaps as [[answer]]; alternatives with "|"; "-" means: nothing goes here.
  function panelExercises(p, c) {
    if (!c.exercises || !c.exercises.length) { p.innerHTML = '<p class="muted">Keine Übungen in dieser Stunde.</p>'; return; }
    p.innerHTML = c.exercises.map(function (ex, ei) {
      var items = ex.items.map(function (it, ii) {
        var gi = 0;
        var text = esc(it.q).replace(/\[\[(.*?)\]\]/g, function (m, ans) {
          var short = ans.split("|").every(function (a) { return a.length <= 3; });
          var id = "g-" + ei + "-" + ii + "-" + (gi++);
          return '<input type="text" class="gap' + (short ? " short" : "") + '" id="' + id + '" data-ans="' + esc(ans) + '" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" enterkeyhint="next" aria-label="Lücke">';
        });
        return "<li>" + text + (it.note ? ' <span class="muted" style="font-size:.85rem">(' + esc(it.note) + ")</span>" : "") + "</li>";
      }).join("");
      return '<article class="block exercise" data-ex="' + ei + '"><h2>' + esc(ex.title) + "</h2>" + (ex.intro ? '<p class="muted">' + ex.intro + "</p>" : "") +
        '<ol class="ex-items">' + items + '</ol><div class="ex-actions"><button class="btn primary" data-act="check">Prüfen</button><button class="btn" data-act="show">Lösung</button><button class="btn" data-act="reset">Leeren</button><span class="ex-score" aria-live="polite"></span></div></article>';
    }).join("");
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
      gaps.forEach(function (g) {
        if (saved[g.id]) g.value = saved[g.id];
        g.addEventListener("input", function () { saved[g.id] = g.value; store.set(key, saved); g.classList.remove("ok", "no"); });
      });
      var filled = gaps.filter(function (g) { return g.value; }).length;
      if (filled) $(".ex-score", box).textContent = filled + " / " + gaps.length + " ausgefüllt";
      box.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-act]"); if (!btn) return;
        var act = btn.dataset.act, ok = 0;
        $$(".sol", box).forEach(function (s) { s.remove(); });
        if (act === "reset") {
          if (!resetArmed) {
            btn.textContent = "Wirklich leeren?"; btn.classList.add("danger");
            resetArmed = setTimeout(function () { btn.textContent = "Leeren"; btn.classList.remove("danger"); resetArmed = null; }, 3000);
            return;
          }
          clearTimeout(resetArmed); resetArmed = null; btn.textContent = "Leeren"; btn.classList.remove("danger");
          gaps.forEach(function (g) { g.value = ""; g.classList.remove("ok", "no"); });
          saved = {}; store.set(key, saved);
          $(".ex-score", box).textContent = "";
          return;
        }
        var firstWrong = null;
        gaps.forEach(function (g) {
          var alts = g.dataset.ans.split("|");
          if (act === "show") { g.insertAdjacentHTML("afterend", '<span class="sol">' + esc(alts[0] === "-" ? "—" : alts[0]) + "</span>"); return; }
          var v = normalize(g.value);
          var good = alts.some(function (a) { return a === "-" ? (v === "" || v === "-" || v === "x" || v === "—") : normalize(a) === v; });
          if (good) ok++; else if (!firstWrong) firstWrong = g;
          g.classList.toggle("ok", good); g.classList.toggle("no", !good);
        });
        if (act === "check") {
          $(".ex-score", box).textContent = ok + " / " + gaps.length + " richtig";
          if (firstWrong) firstWrong.scrollIntoView({ block: "center", behavior: "smooth" });
        } else $(".ex-score", box).textContent = "";
      });
    });
  }

  /* ---------- notes ---------- */
  function panelNotes(p, c) {
    var key = "b2note:" + c.id;
    p.innerHTML = '<div class="block"><h2>Meine Notizen zu Stunde ' + c.nr + '</h2><p class="muted">Wird automatisch auf diesem Gerät gespeichert. Andere sehen deine Notizen nicht.</p>' +
      '<textarea class="notes-box" id="note-' + esc(c.id) + '" placeholder="Eigene Beispielsätze, Fragen an die Lehrkraft, Eselsbrücken …"></textarea><span class="saved" id="saved" aria-live="polite"></span></div>';
    var ta = $(".notes-box", p), t;
    ta.value = store.get(key, "");
    var save = function () { $("#saved").textContent = store.set(key, ta.value) ? "Gespeichert" : "Speichern auf diesem Gerät nicht möglich"; };
    ta.addEventListener("input", function () { clearTimeout(t); $("#saved").textContent = "…"; t = setTimeout(save, 400); });
    ta.addEventListener("blur", function () { clearTimeout(t); save(); });
  }

  /* ---------- global pages ---------- */
  function renderAllVocab(app) {
    app.innerHTML = '<header class="lesson-head"><span class="eyebrow">Alle Stunden</span><h1>Wortschatz</h1></header><section class="panel" id="panel"></section>';
    vocabUI($("#panel"), allVocab(), true);
  }
  function renderAllCards(app) {
    app.innerHTML = '<header class="lesson-head"><span class="eyebrow">Alle Stunden gemischt</span><h1>Karteikarten</h1></header><section class="panel" id="panel"></section>';
    cardsUI($("#panel"), allVocab(), function (v) { return "Stunde " + v.cls.nr; });
  }
  function renderAllNotes(app) {
    var cls = sorted();
    var html = '<header class="lesson-head"><span class="eyebrow">Nur auf deinem Gerät</span><h1>Meine Notizen</h1></header>';
    var any = false, text = "";
    cls.forEach(function (c) {
      var n = (store.get("b2note:" + c.id, "") || "").trim();
      if (!n) return;
      any = true;
      text += "Stunde " + c.nr + ": " + c.title + "\n" + n + "\n\n";
      html += '<article class="block note-item"><h2><a href="#' + c.id + '-notizen">Stunde ' + c.nr + ": " + esc(c.title) + "</a></h2><pre>" + esc(n) + "</pre></article>";
    });
    if (!any) {
      html += '<div class="callout">Noch keine Notizen. Öffne eine Stunde und schreib im Tab „Notizen“.</div>';
      html += '<div class="class-list">' + cls.map(function (c) { return '<a class="class-card" href="#' + c.id + '-notizen"><span class="class-no">Stunde ' + c.nr + "</span><div><h3>" + esc(c.title) + '</h3></div><span class="go" aria-hidden="true">→</span></a>'; }).join("") + "</div>";
    } else {
      html += '<div class="toolbar">' + (navigator.share ? '<button class="btn primary" id="share-notes">Teilen</button>' : "") +
        '<button class="btn' + (navigator.share ? "" : " primary") + '" id="copy-notes">Kopieren</button>' +
        (navigator.share ? "" : '<button class="btn" id="dl-notes">Als Textdatei speichern</button>') +
        '<span class="saved" id="copied" aria-live="polite"></span></div>';
    }
    app.innerHTML = html;
    if (!any) return;
    var done = function (msg) { $("#copied").textContent = msg; };
    var sh = $("#share-notes");
    if (sh) sh.addEventListener("click", function () { navigator.share({ title: "Meine B2-Notizen", text: text }).catch(function () {}); });
    $("#copy-notes").addEventListener("click", function () {
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { done("Kopiert"); }, function () { done("Kopieren nicht möglich. Bitte Text markieren und kopieren."); });
      else done("Kopieren nicht möglich. Bitte Text markieren und kopieren.");
    });
    var dl = $("#dl-notes");
    if (dl) dl.addEventListener("click", function () {
      var a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
      a.download = "B2-Notizen.txt"; document.body.appendChild(a); a.click(); a.remove();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTheme();
    window.addEventListener("hashchange", route);
    route();
    if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    }
  });
})();
