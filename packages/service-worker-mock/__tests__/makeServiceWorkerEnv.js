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
      expect(Object.keys(self.listeners).length).toEqual(0);
      self.addEventListener('fetch', () => {});
      expect(Object.keys(self.listeners).length).toEqual(1);
      self.listeners.reset();
      expect(Object.keys(self.listeners).length).toEqual(0);
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

    it('should allow resetting clients', async () => {
      const client = await self.clients.openWindow('/');
      expect(await clients.get(client.id)).toBe(client);
      clients.reset();
      expect(await clients.get(client.id)).toBe(null);
    });
  });
});
