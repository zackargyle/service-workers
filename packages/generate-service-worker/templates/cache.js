/*
 * Browser Globals:
 *    self - the service worker context
 *    caches
 * Injected Globals:
 *    $Cache {
 *      precache: Array<url>
 *    }
 */

const CACHE_VERSION = 1;
const CURRENT_CACHES = {
  prefetch: `prefetch-${CACHE_VERSION}`,
};
const CURRENT_CACHE_NAMES = Object.keys(CURRENT_CACHES).map(function(key) {
  return CURRENT_CACHES[key];
});

self.addEventListener('install', handleInstall);
self.addEventListener('activate', handleActivate);
if ($Cache.strategy) {
  self.addEventListener('fetch', handleFetch);
}

function handleInstall(event) {
  // console.log('Entering install handler.', event);
  if ($Cache.prefetch) {
    event.waitUntil(prefetch);
  } else {
    event.waitUntil(self.skipWaiting());
  }
}

function handleActivate(event) {
  // console.log('Entering activate handler.', event);
  const cachesCleared = caches.keys().then(function(cacheNames) {
    return Promise.all(
      cacheNames.map(function(cacheName) {
        if (!CURRENT_CACHE_NAMES.includes(cacheName)) {
          // console.log('Deleting out of date cache:', cacheName);
          return caches.delete(cacheName);
        }
      })
    );
  });
  event.waitUntil(cachesCleared);
}

function handleFetch(event) {
  // console.log('Entering fetch handler.', event);

  const checkInCache = caches.match(event.request).then(function(response) {
    if (response) {
      // console.log('Cache hit.', response);
      return response;
    }
    return fetch(event.request).then(function(response) {
      // console.log('Fetch complete.', response);
      return response;
    }).catch(function(error) {
      // console.error('Fetch failed. Most likely offline.', error);
      const offlineStrategy = getOfflineStrategy($Cache.strategy);
      throw error;
    });
  });

  event.respondWith(checkInCache);
}

function prefetch() {
  caches.open(CURRENT_CACHES.prefetch).then(function(cache) {
    const cachePromises = $Cache.precache.map(function(urlToPrefetch) {

      const url = new URL(urlToPrefetch, location.href);
      url.search += (url.search ? '&' : '?') + `cache-bust=${Date.now()}`;

      const request = new Request(url, { mode: 'no-cors' });
      return fetch(request).then(function(response) {
        if (response.status >= 400) {
          throw new Error(`Request for ${urlToPrefetch} failed with status ${response.statusText}.`);
        }
        return cache.put(urlToPrefetch, response);
      }).catch(function(error) {
        console.error(`Not caching ${urlToPrefetch} due to ${error}`);
      });
    });

    return Promise.all(cachePromises).then(function() {
      console.log('Prefetch complete.');
    });
  }).catch(function(error) {
    console.error('Prefetch failed.', error);
  });
}

function getOfflineStrategy(strategy) {

}
