/* Saved pronunciation clips, with the device voice as a fallback. */
(function () {
  "use strict";
  var available = Object.create(null);
  (window.B2_AUDIO_INDEX || []).forEach(function (id) { available[id] = true; });
  var base = new URL("../audio/", document.currentScript.src);
  var current = null;
  var fallbackOnError = null;

  function clean(value) {
    var entities = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
    var plain = String(value || "").replace(/<br\s*\/?\s*>/gi, " ").replace(/<[^>]*>/g, "")
      .replace(/&(#(?:x[0-9a-f]+|[0-9]+)|[a-z]+);/gi, function (whole, entity) {
        if (entity.charAt(0) === "#") {
          var number = entity.charAt(1).toLowerCase() === "x" ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
          return number > 0 && number <= 0x10ffff ? String.fromCodePoint(number) : whole;
        }
        return entities[entity.toLowerCase()] || whole;
      });
    return plain.replace(/\([^)]*\)/g, "").replace(/\s*\/\s*/g, ", ")
      .replace(/[+]\s*(Akk|Dat)\w*/g, "").replace(/…/g, "")
      .replace(/\s+/g, " ").trim();
  }
  function id(text) {
    var value = 2166136261;
    for (var i = 0; i < text.length; i++) {
      value ^= text.charCodeAt(i);
      value = Math.imul(value, 16777619);
    }
    return (value >>> 0).toString(16).padStart(8, "0");
  }
  function stop() {
    if (!current) return;
    current.pause();
    current.removeAttribute("src");
    current.load();
    current = null;
    fallbackOnError = null;
  }
  function say(text, fallback, slow) {
    var spoken = clean(text);
    stop();
    if (!spoken || !available[id(spoken)]) { fallback(); return; }
    if (navigator.audioSession) { try { navigator.audioSession.type = "playback"; } catch (e) {} }
    var audio = new Audio(new URL(id(spoken) + ".mp3", base).href);
    current = audio;
    audio.playbackRate = slow ? 0.75 : 1;
    fallbackOnError = function () {
      if (current !== audio) return;
      current = null;
      fallbackOnError = null;
      fallback();
    };
    audio.onerror = fallbackOnError;
    var started = audio.play();
    if (started && started.catch) started.catch(fallbackOnError);
  }
  window.B2Audio = { say: say, stop: stop, clean: clean, hasSaved: function () { return Object.keys(available).length > 0; } };
})();
