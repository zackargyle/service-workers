const makeServiceWorkerEnv = require('../index');

describe('installation', () => {
  it('should make a valid service worker environment', () => {
    Object.assign(global, makeServiceWorkerEnv());
    expect(self).toBeDefined();
    expect(self instanceof ServiceWorkerGlobalScope).toBe(true);
  });

  it('should allow location overrides', () => {
    Object.assign(global, makeServiceWorkerEnv({
      locationUrl: '/scope',
      locationBase: 'https://oh.yeah'
    }));
    expect(self.location instanceof URL).toBe(true);
    expect(self.location.href).toEqual('https://oh.yeah/scope');
  });

  describe('environment resets', () => {
    Object.assign(global, makeServiceWorkerEnv());

    it('should allow resetting listeners', () => {
      expect(self.listeners.size).toEqual(0);
      self.addEventListener('fetch', () => {});
      expect(self.listeners.size).toEqual(1);
      self.listeners.reset();
      expect(self.listeners.size).toEqual(0);
    });

    it('should allow resetting caches', async () => {
      expect(await self.caches.has('TEST')).toBe(false);
      await self.caches.open('TEST');
      expect(await self.caches.has('TEST')).toBe(true);
      self.caches.reset();
      expect(await self.caches.has('TEST')).toBe(false);
    });

    it('should allow resetting an individual cache', async () => {
      const testResponse = new Response();
      const cache = await self.caches.open('TEST');
      await cache.put(new Request('/'), testResponse);
      expect(await cache.match(new Request('/'))).toBe(testResponse);
      cache.reset();
      expect(await cache.match(new Request('/'))).toBe(null);
    });

    it('should allow cacheName option for caches.match', async () => {
      const testResponse1 = new Response('body1');
      const testResponse2 = new Response('body2');
      const cache1 = await self.caches.open('TEST1');
      const cache2 = await self.caches.open('TEST2');

      await cache1.put(new Request('/'), testResponse1);
      await cache2.put(new Request('/'), testResponse2);

      const cacheResponse = await caches.match(new Request('/'), {
        cacheName: 'TEST2'
      });

      expect(cacheResponse).toBe(testResponse2);
    });

    it('should allow resetting clients', async () => {
      const client = await self.clients.openWindow('/');
      expect(await clients.get(client.id)).toBe(client);
      clients.reset();
      expect(await clients.get(client.id)).toBe(null);
    });

    it('should allow resetting everything', async () => {
      self.addEventListener('fetch', () => {});
      await self.caches.open('TEST');
      const client = await self.clients.openWindow('/');

      expect(self.listeners.size).toEqual(1);
      expect(await self.caches.has('TEST')).toBe(true);
      expect(await clients.get(client.id)).toBe(client);
      self.resetSwEnv();
      expect(self.listeners.size).toEqual(0);
      expect(await self.caches.has('TEST')).toBe(false);
      expect(await clients.get(client.id)).toBe(null);
    });

    it('should allow resetting IDB');
  });
});
