// This is the service worker with the Cache-first network

const CACHE = "pwabuilder-precache";
const precacheFiles = [
  /* Add an array of files to precache for your app */
  './index.html',
  './assets/game.js',
  './assets/kaiads.min.js',
  './assets/phaser-arcade-physics.min.js',
  './assets/ua-parser.min.js',
  // 'https://www.googletagmanager.com/gtag/js?id=UA-150350318-1',
  './assets/images/taara-logo.png',
  './assets/images/spriteAtlas.json',
  './assets/images/spriteAtlas.png',
  './assets/images/numbers.png',
  './assets/audio/chime-airy.wav',
  './assets/audio/chime-triad.wav',
  './assets/icons/icon56.png',
  './assets/icons/icon112.png'

];

self.addEventListener("install", function (event) {
  console.log("[PWA Taara Games] Install Event processing");

  console.log("[PWA Taara Games] Skip waiting on install");
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      console.log("[PWA Taara Games] Caching pages during install");
      return cache.addAll(precacheFiles);
    })
  );
});

// Allow sw to control of current page
self.addEventListener("activate", function (event) {
  console.log("[PWA Taara Games] Claiming clients for current page");
  event.waitUntil(self.clients.claim());
});

// If any fetch fails, it will look for the request in the cache and serve it from there first
self.addEventListener("fetch", function (event) { 
  if (event.request.method !== "GET") return;

  event.respondWith(
    fromCache(event.request).then(
      function (response) {
        // The response was found in the cache so we responde with it and update the entry

        // This is where we call the server to get the newest version of the
        // file to use the next time we show view
        event.waitUntil(
          fetch(event.request).then(function (response) {
            return updateCache(event.request, response);
          })
        );

        return response;
      },
      function () {
        // The response was not found in the cache so we look for it on the server
        return fetch(event.request)
          .then(function (response) {
            // If request was success, add or update it in the cache
            event.waitUntil(updateCache(event.request, response.clone()));

            return response;
          })
          .catch(function (error) {
            console.log("[PWA Taara Games] Network request failed and no cache." + error);
          });
      }
    )
  );
});

function fromCache(request) {
  // Check to see if you have it in the cache
  // Return response
  // If not in the cache, then return
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      if (!matching || matching.status === 404) {
        return Promise.reject("no-match");
      }

      return matching;
    });
  });
}

function updateCache(request, response) {
  return caches.open(CACHE).then(function (cache) {
    return cache.put(request, response);
  });
}
