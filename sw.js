// Web aplikacija "RINNO Cartesian": stranica se sprema na mobitel da se otvara odmah i bez signala;
// podaci (podaci.enc) i komentari (komentari.enc) se UVIJEK traze svjezi, a stari se pokazu samo kad nema interneta.
const VERZIJA = "rinno-cartesian-8";
const LJUSKA = ["./", "index.html", "manifest.webmanifest", "ikona-192.png", "ikona-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERZIJA).then(c => c.addAll(LJUSKA))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== VERZIJA).map(x => caches.delete(x)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin || e.request.method !== "GET") return;   // GitHub (spremanje komentara) ide mimo
  const ime = ["podaci.enc", "komentari.enc"].find(x => url.pathname.endsWith(x));
  if (ime) {
    e.respondWith(fetch(e.request, { cache: "no-cache" }).then(r => {   // uvijek pitaj server (ime se mijenjalo 23.10.)
      if (r.ok) { const kopija = r.clone(); caches.open(VERZIJA).then(c => c.put(ime, kopija)); }
      return r;
    }).catch(() => caches.match(ime)));
    return;
  }
  e.respondWith(fetch(e.request, { cache: "no-cache" }).then(r => {   // uvijek pitaj server (ime se mijenjalo 23.10.)
    const kopija = r.clone(); caches.open(VERZIJA).then(c => c.put(e.request, kopija)); return r;
  }).catch(() => caches.match(e.request)));
});
