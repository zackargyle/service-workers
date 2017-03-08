/*         -------- CACHE ---------         */

const CURRENT_CACHE = `SW_CACHE:${$VERSION}`;
const APP_SHELL_CACHE = 'SW_APP_SHELL';

const isValidResponse = res => (res.ok || (res.status === 0 && res.type === 'opaque'));
const isNavigation = req => req.mode === 'navigate' || (req.method === 'GET' && req.headers.get('accept').includes('text/html'));

/*         -------- CACHE LISTENERS ---------         */

self.addEventListener('install', handleInstall);
self.addEventListener('activate', handleActivate);
if ($Cache.precache || $Cache.offline || $Cache.strategy) {
  self.addEventListener('fetch', handleFetch);
}

/*         -------- CACHE HANDLERS ---------         */

function handleInstall(event) {
  logger.log('Entering install handler.');
  self.skipWaiting();
  if ($Cache.precache) {
    event.waitUntil(precache());
  }
}

function handleActivate(event) {
  logger.log('Entering activate handler.');
  const cachesCleared = caches.keys().then(cacheNames => {
    logger.group('cleanup');
    return Promise.all(cacheNames.map(cacheName => {
      if (CURRENT_CACHE !== cacheName) {
        logger.log(`Deleting cache key: ${cacheName}`, 'cleanup');
        return caches.delete(cacheName);
      }
      return Promise.resolve();
    })).then(() => logger.groupEnd('cleanup'));
  });
  event.waitUntil(cachesCleared);
}

function handleFetch(event) {
  if (isNavigation(event.request)) {
    if ($Cache.offline) {
      event.respondWith(
        fetchAndCacheAppShell(event.request)
          .catch(() => caches.match(APP_SHELL_CACHE))
          .catch(() => undefined)
      );
    }
  } else if (event.request.method === 'GET') {
    const strategy = getStrategyForUrl(event.request.url);
    if (strategy) {
      logger.group(event.request.url);
      logger.log(`Using strategy ${strategy.type}.`, event.request.url);
      event.respondWith(
        applyEventStrategy(strategy, event).then(response => {
          logger.groupEnd(event.request.url);
          return response;
        }).catch(() => undefined)
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

function insertInCache(request, response) {
  logger.log('Inserting in cache.', request.url);
  return caches.open(CURRENT_CACHE)
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
      return strategy.matches.some(match => {
        const regex = new RegExp(match);
        return regex.test(url);
      });
    });
  }
  return null;
}

function fetchAndCache(request) {
  return () => {
    logger.log('Fetching remote data.', request.url);
    return fetch(request).then(response => {
      if (isValidResponse(response)) {
        logger.log('Caching remote response.', request.url);
        insertInCache(request, response.clone());
      } else {
        logger.log('Fetch error.', request.url);
      }
      return response;
    });
  };
}

function fetchAndCacheAppShell(request) {
  return fetch(request).then(response => {
    if (isValidResponse(response)) {
      logger.log('Caching app shell.', request.url);
      insertInCache(APP_SHELL_CACHE, response.clone());
    }
    return response;
  });
}

function fallbackToCache(request) {
  return (response) => {
    if (!isValidResponse(response)) {
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
      .then(raceResolve)
      .catch(raceReject);

    fetchAndCache(request, strategy)()
      .then(raceResolve)
      .catch(raceReject);
  });
}

function precache() {
  logger.group('precaching');
  return caches.open(CURRENT_CACHE).then(cache => {
    return Promise.all(
      $Cache.precache.map(urlToPrefetch => {
        logger.log(urlToPrefetch, 'precaching');
        const cacheBustedUrl = new URL(urlToPrefetch, location.href);
        cacheBustedUrl.search += (cacheBustedUrl.search ? '&' : '?') + `cache-bust=${Date.now()}`;

        const request = new Request(cacheBustedUrl, { mode: 'no-cors' });
        return fetch(request).then(response => {
          if (!isValidResponse(response)) {
            logger.error(`Failed for ${urlToPrefetch}.`, 'precaching');
            return undefined;
          }
          return cache.put(urlToPrefetch, response);
        });
      })
    );
  }).then(() => logger.groupEnd('precaching'));
}
