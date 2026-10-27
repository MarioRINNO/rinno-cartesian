// Web aplikacija "RINNO Cartesian": stranica se sprema na mobitel da se otvara odmah i bez signala;
// podaci (podaci.enc) se UVIJEK traze svjezi, a stari se pokazu samo kad nema interneta.
const VERZIJA = "rinno-cartesian-6";
const LJUSKA = ["./", "index.html", "manifest.webmanifest", "ikona-192.png", "ikona-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERZIJA).then(c => c.addAll(LJUSKA))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== VERZIJA).map(x => caches.delete(x)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (url.pathname.endsWith("podaci.enc")) {
    e.respondWith(fetch(e.request, { cache: "no-cache" }).then(r => {   // uvijek pitaj server (ime se mijenjalo 23.10.)
      const kopija = r.clone(); caches.open(VERZIJA).then(c => c.put("podaci.enc", kopija)); return r;
    }).catch(() => caches.match("podaci.enc")));
    return;
  }
  e.respondWith(fetch(e.request, { cache: "no-cache" }).then(r => {   // uvijek pitaj server (ime se mijenjalo 23.10.)
    const kopija = r.clone(); caches.open(VERZIJA).then(c => c.put(e.request, kopija)); return r;
  }).catch(() => caches.match(e.request)));
});
