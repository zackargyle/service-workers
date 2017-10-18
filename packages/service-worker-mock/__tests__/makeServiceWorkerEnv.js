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
});
