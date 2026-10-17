/* Offline support for the flashcard site. Its own scope (flashcards/), so offline it
   falls back to this site's page, not the main site's. Network first, then the saved copy. */
var CACHE = "b2-karten-v1";
var SHELL = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "style.css",
  "app.js",
  "../assets/icons/icon-192.png",
  "../assets/icons/apple-touch-icon.png",
  "../classes/tag-00.js", "../classes/wortliste-a1-b1.js",
  "../classes/tag-01.js",
  "../classes/tag-02.js"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf("b2-karten-") === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

function fromNetwork(req, cache, ms) {
  return new Promise(function (resolve, reject) {
    var t = setTimeout(reject, ms);
    fetch(req).then(function (res) {
      clearTimeout(t);
      if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
      resolve(res);
    }, function (err) { clearTimeout(t); reject(err); });
  });
}

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  var sameOrigin = url.origin === self.location.origin;
  var fonts = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (!sameOrigin && !fonts) return;

  e.respondWith(caches.open(CACHE).then(function (cache) {
    if (fonts) return cache.match(req).then(function (hit) { return hit || fromNetwork(req, cache, 10000); });
    return fromNetwork(req, cache, 4000).catch(function () {
      return cache.match(req, { ignoreSearch: true }).then(function (hit) {
        return hit || (req.mode === "navigate" ? cache.match("index.html") : Response.error());
      });
    });
  }));
});
