const makeServiceWorkerEnv = require('../../../service-worker-mock');
const fixtures = require('../../../../testing/fixtures');

// Injected vars
global.$VERSION = '18asd9a8dfy923';

// Constants
const CURRENT_CACHE = `SW_CACHE:${$VERSION}`;
const TEST_JS_PATH = 'test.js';
const Request = fixtures.Request;
const cachedResponse = fixtures.Response({ value: 1 });
const runtimeResponse = fixtures.Response({ value: 2 });

describe('[generate-service-worker/templates] cache', function test() {
  beforeEach(() => {
    Object.assign(global, makeServiceWorkerEnv());
    global.fetch.mockClear();
    jest.resetModules();
  });

  describe('precache', () => {
    beforeEach(() => {
      global.$Cache = fixtures.$Cache();
      require('../cache');
    });

    it('should not precache if empty', async () => {
      global.$Cache.precache = undefined;
      expect(self.snapshot().caches.hasOwnProperty(CURRENT_CACHE)).toEqual(false);
      await self.trigger('install');
      expect(self.snapshot().caches.hasOwnProperty(CURRENT_CACHE)).toEqual(false);
    });

    it('should handle precaching', async () => {
      global.$Cache.precache = [TEST_JS_PATH];
      global.fetch.mockImplementation(() => Promise.resolve(runtimeResponse));

      expect(self.snapshot().caches.hasOwnProperty(CURRENT_CACHE)).toEqual(false);
      await self.trigger('install');
      expect(self.snapshot().caches[CURRENT_CACHE][TEST_JS_PATH]).toEqual(runtimeResponse);
    });
  });

  describe('[offline]', () => {
    beforeEach(() => {
      global.$Cache.offlineURL = '/offline';
      require('../cache');
    });

    it('should precache the offlineURL', async () => {
      global.fetch.mockImplementation(() => Promise.resolve(cachedResponse));
      expect(self.snapshot().caches.hasOwnProperty(CURRENT_CACHE)).toEqual(false);
      await self.trigger('install');
      expect(self.snapshot().caches[CURRENT_CACHE]['/offline']).toEqual(cachedResponse);
    });

    it('should return the precached response if offline', async () => {
      global.fetch.mockImplementation(() => Promise.resolve(cachedResponse));
      await self.trigger('install');

      global.fetch.mockImplementation(() => {
        return new Promise(() => {
          throw new Error('offline');
        });
      });
      const response = await self.trigger('fetch', Request({ mode: 'navigate' }));
      expect(response).toEqual(cachedResponse);
    });

    it('should return the fetched response if online', async () => {
      global.fetch.mockImplementation(() => Promise.resolve(cachedResponse));
      await self.trigger('install');

      global.fetch.mockImplementation(() => Promise.resolve(runtimeResponse));
      const response = await self.trigger('fetch', Request({ mode: 'navigate' }));
      expect(response).toEqual(runtimeResponse);
    });
  });

  describe('[strategy] offline-only', () => {
    beforeEach(() => {
      global.$Cache = fixtures.$Cache({
        strategy: [{
          type: 'offline-only',
          matches: ['.*\\.js']
        }]
      });
      require('../cache');
    });

    it('should return fetch response if not offline', async () => {
      global.fetch.mockImplementation(() => Promise.resolve(runtimeResponse));

      const cache = await self.caches.open(CURRENT_CACHE);
      cache.put(Request(), cachedResponse);

      const response = await self.trigger('fetch', Request());
      expect(response).toEqual(runtimeResponse);
    });

    it('should return cached data if offline', async () => {
      // Go offline
      global.fetch.mockImplementation(() => {
        return new Promise(() => {
          throw new Error('offline');
        });
      });

      // Fill cache with item
      const cache = await self.caches.open(CURRENT_CACHE);
      await cache.put(Request(), cachedResponse);

      const response = await self.trigger('fetch', Request());
      expect(response).toEqual(cachedResponse);
    });

    it('should fail gracefully if nothing in cache and offline', async () => {
      // Go offline
      global.fetch.mockImplementation(() => {
        return new Promise(() => {
          throw new Error('offline');
        });
      });
      const response = await self.trigger('fetch', Request());
      expect(response).toEqual(undefined);
    });
  });

  describe('[strategy] fallback-only', () => {
    beforeEach(() => {
      global.$Cache = fixtures.$Cache({
        strategy: [{
          type: 'fallback-only',
          matches: ['.*\\.js']
        }]
      });
      require('../cache');
    });

    it('should use fetch response if valid', async () => {
      global.fetch.mockImplementation(() => Promise.resolve(runtimeResponse));

      const response = await self.trigger('fetch', Request());
      expect(response).toEqual(runtimeResponse);
    });

    it('should use cached response if invalid fetch response', async () => {
      global.fetch.mockImplementation(() => Promise.resolve(Response({ ok: false })));

      // Fill cache with item
      const cache = await self.caches.open(CURRENT_CACHE);
      await cache.put(Request(), cachedResponse);

      const response = await self.trigger('fetch', Request());
      expect(response).toEqual(cachedResponse);
    });

    it('should fail gracefully if nothing in cache and fetch fails', async () => {
      global.fetch.mockImplementation(() => Promise.resolve(Response({ ok: false })));

      const response = await self.trigger('fetch', Request());
      expect(response).toEqual(undefined);
    });
  });

  describe('[strategy] prefer-cache', () => {
    beforeEach(() => {
      global.$Cache = fixtures.$Cache({
        strategy: [{
          type: 'prefer-cache',
          matches: ['.*\\.js']
        }]
      });
      require('../cache');
    });

    it('should use cached response if available', async () => {
      global.fetch.mockImplementation(() => Promise.resolve(runtimeResponse));

      // Fill cache with item
      const cache = await self.caches.open(CURRENT_CACHE);
      await cache.put(Request(), cachedResponse);

      const response = await self.trigger('fetch', Request());
      expect(global.fetch.mock.calls.length).toEqual(0);
      expect(response).toEqual(cachedResponse);
    });

    it('should perform fetch if no cache match', async () => {
      global.fetch.mockImplementation(() => Promise.resolve(runtimeResponse));

      const response = await self.trigger('fetch', Request());
      expect(global.fetch.mock.calls.length).toEqual(1);
      expect(response).toEqual(runtimeResponse);
    });

    it('should cache fetched response', async () => {
      global.fetch.mockImplementation(() => Promise.resolve(runtimeResponse));

      expect(self.snapshot().caches[CURRENT_CACHE]).toEqual(undefined);
      await self.trigger('fetch', Request());
      const cacheValue = self.snapshot().caches[CURRENT_CACHE][TEST_JS_PATH].value;
      expect(cacheValue).toEqual(runtimeResponse.value);
    });
  });

  describe('[strategy] race', () => {
    beforeEach(() => {
      global.$Cache = fixtures.$Cache({
        strategy: [{
          type: 'race',
          matches: ['.*\\.js']
        }]
      });
      require('../cache');
    });

    it('should use cached response when it is faster', async () => {
      // Slow fetch
      global.fetch.mockImplementation(() => new Promise(resolve => {
        setTimeout(() => resolve(runtimeResponse), 50);
      }));

      // Fill cache with item
      const cache = await self.caches.open(CURRENT_CACHE);
      await cache.put(Request(), cachedResponse);

      const response = await self.trigger('fetch', Request());
      expect(response).toEqual(cachedResponse);
    });

    it('should use fetched response when it is faster', async () => {
      global.fetch.mockImplementation(() => Promise.resolve(runtimeResponse));
      // Slow cache
      self.caches.match = () => new Promise(resolve => {
        setTimeout(() => resolve(runtimeResponse), 50);
      });

      // Fill cache with item
      const cache = await self.caches.open(CURRENT_CACHE);
      await cache.put(Request(), cachedResponse);

      const response = await self.trigger('fetch', Request());
      expect(response).toEqual(runtimeResponse);
    });
  });
});
