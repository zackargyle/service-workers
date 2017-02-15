/*         -------- CACHE ---------         */

const CURRENT_CACHE = `SW_CACHE:${$VERSION}`;
const STATIC_CACHE = 'static';
const AVAILABLE_CACHES = [CURRENT_CACHE, STATIC_CACHE];

const inRange = (start, end) => value => value >= start && value < end;

/*         -------- CACHE LISTENERS ---------         */

self.addEventListener('install', handleInstall);
self.addEventListener('activate', handleActivate);
if ($Cache.precache || $Cache.strategy) {
  self.addEventListener('fetch', handleFetch);
}

/*         -------- CACHE HANDLERS ---------         */

function handleInstall(event) {
  logger.log('Entering install handler.');
  if ($Cache.precache) {
    event.waitUntil(precache().then(self.skipWaiting()));
  } else {
    event.waitUntil(self.skipWaiting());
  }
}

function handleActivate(event) {
  logger.log('Entering activate handler.');
  const cachesCleared = caches.keys().then(cacheNames => {
    logger.group('cleanup');
    return Promise.all(cacheNames.map(cacheName => {
      if (!AVAILABLE_CACHES.includes(cacheName)) {
        logger.log(`Deleting cache key: ${cacheName}`, 'cleanup');
        return caches.delete(cacheName);
      }
      return Promise.resolve();
    })).then(() => logger.groupEnd('cleanup'));
  });
  event.waitUntil(cachesCleared);
}

function handleFetch(event) {
  if (event.request.method === 'GET') {
    const strategy = getStrategyForUrl(event.request.url);
    if (strategy) {
      logger.group(event.request.url);
      logger.log(`Using strategy ${strategy.type}.`, event.request.url);
      event.respondWith(
        applyEventStrategy(strategy, event).then(response => {
          logger.groupEnd(event.request.url);
          return response;
        })
      );
    }
  }
}

/*         -------- CACHE HELPERS ---------         */

function applyEventStrategy(strategy, event) {
  const request = event.request;
  switch (strategy.type) {
    case 'offline-only':
      return fetchAndCache(request, strategy)().catch(getFromCache(request));
    case 'fallback-only':
      return fetchAndCache(request, strategy)().then(fallbackToCache(request));
    case 'prefer-cache':
      return getFromCache(request)().catch(fetchAndCache(request, strategy));
    case 'race':
      return getFromFastest(request, strategy)();
    default:
      return Promise.reject(`Strategy not supported: ${strategy.type}`);
  }
}

function insertInCache(request, response, strategy) {
  logger.log('Inserting in cache.', request.url);
  const cacheName = strategy.keepAlive ? STATIC_CACHE : CURRENT_CACHE;
  return caches.open(cacheName)
    .then(cache => cache.put(request, response));
}

function getFromCache(request) {
  return () => {
    return caches.match(request).then(response => {
      if (response) {
        logger.log('Found entry in cache.', request.url);
        return response;
      }
      logger.log('No entry found in cache.', request.url);
      throw new Error(`No cache entry found for ${request.url}`);
    });
  };
}

function getStrategyForUrl(url) {
  if ($Cache.strategy) {
    return $Cache.strategy.find(strategy => {
      const regex = new RegExp(strategy.matches);
      return regex.test(url);
    });
  }
  return null;
}

function fetchAndCache(request, strategy) {
  return () => {
    logger.log('Fetching remote data.', request.url);
    return fetch(request.clone()).then(_response => {
      const response = _response.clone();
      if (inRange(200, 400)(response.status)) {
        logger.log('Caching remote response.', request.url);
        insertInCache(request, response, strategy);
      } else {
        logger.log('Fetch error.', request.url);
      }
      return _response;
    });
  };
}

function fallbackToCache(request) {
  return (response) => {
    if (!inRange(200, 400)(response.status)) {
      return getFromCache(request)();
    }
    return response;
  };
}

function getFromFastest(request, strategy) {
  return () => new Promise((resolve, reject) => {
    var errors = 0;

    function raceReject() {
      errors += 1;
      if (errors === 2) {
        reject(new Error('Network and cache both failed.'));
      }
    }

    function raceResolve(response) {
      if (response instanceof Response) {
        resolve(response);
      } else {
        raceReject();
      }
    }

    getFromCache(request)()
      .then(raceResolve, raceReject);

    fetchAndCache(request, strategy)()
      .then(raceResolve, raceReject);
  });
}

function precache() {
  logger.group('precaching');
  return caches.open(CURRENT_CACHE).then(cache => {
    return $Cache.precache.map(urlToPrefetch => {
      logger.log(urlToPrefetch, 'precaching');
      const cacheBustedUrl = new URL(urlToPrefetch, location.href);
      cacheBustedUrl.search += (cacheBustedUrl.search ? '&' : '?') + `cache-bust=${Date.now()}`;

      const request = new Request(cacheBustedUrl, { mode: 'no-cors' });
      return fetch(request).then(response => {
        if (!inRange(200, 400)(response.status)) {
          logger.error(`Failed for ${urlToPrefetch}.`, 'precaching');
          return undefined;
        }
        return cache.put(urlToPrefetch, response);
      });
    });
  }).then(() => logger.groupEnd('precaching'));
}

// Export functions on the server for testing
if (typeof __TEST_MODE__ !== 'undefined') {
  module.exports = {
    handleInstall: handleInstall,
    handleActivate: handleActivate,
    handleFetch: handleFetch,
    applyEventStrategy: applyEventStrategy,
    getStrategyForUrl: getStrategyForUrl,
    insertInCache: insertInCache,
    getFromCache: getFromCache,
    fetchAndCache: fetchAndCache,
    fallbackToCache: fallbackToCache,
    getFromFastest: getFromFastest,
    precache: precache
  };
}
