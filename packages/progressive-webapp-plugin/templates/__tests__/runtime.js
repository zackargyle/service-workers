

const runtime = require('../runtime');

describe('[progressive-webapp-plugin/templates] runtime', function () {
  afterEach(() => {
    global.navigator.serviceWorker.register.mockClear();
  });

  it('> register should register a service worker', function () {
    runtime.register();
    expect(navigator.serviceWorker.register.mock.calls.length).toEqual(1);
    expect(navigator.serviceWorker.register.mock.calls[0][0]).toEqual($LocationMap.main);
  });

  it('> register should register an experimental service worker', function () {
    runtime.register('test');
    expect(navigator.serviceWorker.register.mock.calls.length).toEqual(1);
    expect(navigator.serviceWorker.register.mock.calls[0][0]).toEqual($LocationMap.test);
  });

  it('> register should throw for an invalid experimental service worker key', function () {
    expect(runtime.register.bind(null, 'blah')).toThrow();
  });

  it('> requestNotificationsPermission should try to subscribe', function () {
    runtime.requestNotificationsPermission('test');
    const calls = navigator.serviceWorker.pushManager.subscribe.mock.calls;
    expect(calls.length).toEqual(1);
    expect(calls[0][0]).toEqual({ userVisibleOnly: true });
  });
});
