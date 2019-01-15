const makeServiceWorkerEnv = require('../index');
const ServiceWorkerRegistration = require('../models/ServiceWorkerRegistration');
const SyncManager = require('../models/SyncManager');

describe('registration', () => {
  beforeEach(() => {
    Object.assign(global, makeServiceWorkerEnv());
    jest.resetModules();
  });

  it('should expose a mocked service worker registration', () => {
    expect(global).toHaveProperty('registration');
    expect(global.registration).toBeInstanceOf(ServiceWorkerRegistration);
  });

  it('has a sync interface', () => {
    expect(global.registration).toHaveProperty('sync');
    expect(global.registration.sync).toBeInstanceOf(SyncManager);
  });
});
