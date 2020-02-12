const makeServiceWorkerEnv = require('../index');

// https://github.com/GoogleChrome/samples/blob/gh-pages/service-worker/basic/service-worker.js
describe('basic', () => {
   beforeEach(() => {
      Object.assign(global, makeServiceWorkerEnv());
      jest.resetModules();
   });

   it('should attach the listeners', () => {
      require('./fixtures/basic');
      expect(Object.keys(self.listeners).length).toEqual(3);
   });

   it('should precache the PRECACHE_URLS on install', async () => {
      global.fetch = () => Promise.resolve('FAKE_RESPONSE');
      require('./fixtures/basic');

      await self.trigger('install');
      const caches = self.snapshot().caches;
      Object.keys(caches['precache-v1']).forEach(key => {
         expect(caches['precache-v1'][key]).toEqual('FAKE_RESPONSE');
      });
   });

   it('should delete old caches on activate', async () => {
      self.caches.open('TEST');
      expect(self.snapshot().caches.TEST).toBeDefined();
      require('./fixtures/basic');

      await self.trigger('activate');
      expect(self.snapshot().caches.TEST).toBeUndefined();
   });

   it('should return a cached response', async () => {
      require('./fixtures/basic');

      const cachedResponse = { clone: () => {} };
      const cachedRequest = new Request('/test');
      const cache = await self.caches.open('TEST');
      cache.put(cachedRequest, cachedResponse);

      const response = await self.trigger('fetch', cachedRequest);
      expect(response).toEqual(cachedResponse);
   });

   it('should fetch and cache an uncached request', async () => {
      const mockResponse = { clone: () => mockResponse };
      global.fetch = () => Promise.resolve(mockResponse);
      require('./fixtures/basic');

      const request = new Request('/test');
      const response = await self.trigger('fetch', request);
      expect(response).toEqual(mockResponse);
      const runtimeCache = self.snapshot().caches.runtime;
      expect(runtimeCache[request.url]).toEqual(mockResponse);
   });

   it('should add clientId to fetch event', async () => {
      expect.assertions(1);

      self.addEventListener('fetch', event => {
         expect(event.clientId).toBe("testClientId");
         return Promise.resolve();
      });

      const request = new Request('/test');
      await self.trigger('fetch', { request, clientId: "testClientId" });
   });
});
