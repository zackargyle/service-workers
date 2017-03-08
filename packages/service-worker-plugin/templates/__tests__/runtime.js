const fixtures = require('../../../../testing/fixtures');
// Injected vars
global.$LocationMap = fixtures.$LocationMap();
// Import main module
const runtime = require('../runtime');

global.navigator = {
  serviceWorker: {
    get ready() {
      return Promise.resolve(navigator.serviceWorker);
    },
    pushManager: {
      subscribe: jest.fn()
    },
    register: jest.fn(() => Promise.resolve())
  }
};

describe('[service-worker-plugin/templates] runtime', function () {
  afterEach(() => {
    global.navigator.serviceWorker.register.mockClear();
  });

  it('> register should register a service worker', async () => {
    await runtime.register();
    expect(navigator.serviceWorker.register.mock.calls.length).toEqual(1);
    expect(navigator.serviceWorker.register.mock.calls[0][0]).toEqual($LocationMap.main);
  });

  it('> register should register an experimental service worker', async () => {
    await runtime.register('test');
    expect(navigator.serviceWorker.register.mock.calls.length).toEqual(1);
    expect(navigator.serviceWorker.register.mock.calls[0][0]).toEqual($LocationMap.test);
  });

  it('> register should throw for an invalid experimental service worker key', function () {
    expect(runtime.register.bind(null, 'blah')).toThrow();
  });

  it('> requestNotificationsPermission should try to subscribe', async () => {
    await runtime.requestNotificationsPermission('test');
    const calls = navigator.serviceWorker.pushManager.subscribe.mock.calls;
    expect(calls.length).toEqual(1);
    expect(calls[0][0]).toEqual({ userVisibleOnly: true });
  });

  it('> register should return a promise whether or not a serviceWorker is supported', function () {
    const oldServiceWorker = navigator.serviceWorker;
    delete navigator.serviceWorker;
    expect(runtime.register().then(() => {}).then).toBeDefined();
    navigator.serviceWorker = oldServiceWorker;
    expect(runtime.register().then(() => {}).then).toBeDefined();
  });
});
