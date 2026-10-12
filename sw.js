/* Offline support. Pages and class files are served from the cache right away and
   refreshed in the background, so new classes show up on the next start. */
var CACHE = "b2-v1";
var SHELL = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "assets/style.css",
  "assets/app.js",
  "assets/icons/icon-192.png",
  "assets/icons/apple-touch-icon.png",
  "classes/stunde-01.js"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  var sameOrigin = url.origin === self.location.origin;
  var fonts = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (!sameOrigin && !fonts) return;

  e.respondWith(caches.open(CACHE).then(function (cache) {
    return cache.match(req, { ignoreSearch: sameOrigin }).then(function (hit) {
      var net = fetch(req).then(function (res) {
        if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
        return res;
      }).catch(function () { return hit; });
      if (hit) { e.waitUntil(net); return hit; }
      return net;
    });
  }));
});
