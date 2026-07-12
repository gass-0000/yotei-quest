const CACHE='yotei-quest-v1.0.0';
const ASSETS=[
  './','./index.html','./manifest.webmanifest','./css/style.css',
  './js/migration.js','./js/storage.js','./js/backup.js','./js/sound.js','./js/animation.js','./js/app.js',
  './assets/images/town-map.png','./assets/images/restaurant-map.png',
  './assets/icons/icon-180.png','./assets/icons/icon-192.png','./assets/icons/icon-512.png'
];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
