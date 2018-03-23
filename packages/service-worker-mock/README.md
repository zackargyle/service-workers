Service Worker Mock
=========================
A mock service worker environment generator.

## Why?
Testing service workers is difficult. Each file produces side-effects by calls to `self.addEventListener`, and the service worker environment is unlike a normal web or node context. This package makes it easy to turn a Node.js environment into a faux service worker environment. Additionally, it adds some helpful methods for testing integrations.

The service worker mock creates an environment with the following properties, based on the current [Mozilla Service Worker Docs](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API).
```js
const env = {
  // Environment polyfills
  skipWaiting: Function,
  caches: CacheStorage,
  clients: Clients,
  registration: ServiceWorkerRegistration,
  addEventListener: Function,
  Request: constructor Function,
  Response: constructor Function,
  URL: constructor Function,

  // Test helpers
  listeners: Object,
  trigger: Function,
  snapshot: Function,
};
 ```

 Test Helper   | description
-------------- | -----------
`listeners`    | [`Object`] A key/value map of active listeners (`install`/`activate`/`fetch`/etc).
`trigger`      | [`Function`] Used to trigger active listeners (`await self.trigger('install')`).
`snapshot`     | [`Function`] Used to generate a snapshot of the service worker internals (see below).

 Snapshot Property   | description
-------------------- | -----------
`caches`              | [`Object`] A key/value map of current cache contents.
`clients`            | [`Array`] A list of active clients.
`notifications`      | [`Array`] A list of active notifications

Additionally we provide a fetch mock in `service-worker-mock/fetch` to easily get up and running (see Getting Started for example).

## Getting Started
The service worker mock is best used by applying its result to the global scope, then calling `require('../sw.js')` with the path to your service worker file. The file will use the global mocks for things like adding event listeners.
```js
const makeServiceWorkerEnv = require('service-worker-mock');
const makeFetchMock = require('service-worker-mock/fetch');

describe('Service worker', () => {
  beforeEach(() => {
    Object.assign(
      global,
      makeServiceWorkerEnv(),
      makeFetchMock(),
      // If you're using sinon ur similar you'd probably use below instead of makeFetchMock
      // fetch: sinon.stub().returns(Promise.resolve())
    );
    jest.resetModules();
  });
  it('should add listeners', () => {
    require('../sw.js');
    expect(self.listeners['install']).toBeDefined();
    expect(self.listeners['activate']).toBeDefined();
    expect(self.listeners['fetch']).toBeDefined();
  });
});
```

## Use
The following is an example snippet derived from [__tests__/basic.js](https://github.com/pinterest/service-workers/blob/master/packages/service-worker-mock/__tests__/basic.js). The test is based on the [service worker example](https://github.com/GoogleChrome/samples/blob/gh-pages/service-worker/basic/service-worker.js) provided by Google. In it, we will verify that on `activate`, the service worker deletes old caches and creates the new one.

```js
const makeServiceWorkerEnv = require('service-worker-mock');

describe('Service worker', () => {
  beforeEach(() => {
    Object.assign(global, makeServiceWorkerEnv());
    jest.resetModules();
  });
  
  it('should delete old caches on activate', async () => {
      require('../sw.js');

      // Create old cache
      await self.caches.open('OLD_CACHE');
      expect(self.snapshot().caches.OLD_CACHE).toBeDefined();

      // Activate and verify old cache is removed
      await self.trigger('activate');
      expect(self.snapshot().caches.OLD_CACHE).toBeUndefined();
      expect(self.snapshot().caches['precache-v1']).toBeDefined();
  });
});
```

## License

MIT
