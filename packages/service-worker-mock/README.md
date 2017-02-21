Service Worker Mock
=========================
A mock service worker environment generator.

## Why?
Testing service workers is difficult. Each file produces side-effects by calls to `self.addEventListener`, and the service worker environment is unlike a normal web or node context. This package makes it easy to turn any environment into a feaux service worker environment. Additionally, it adds some helpful methods for testing integrations.

The service worker mock creates an environment with the following properties, based on the current [Mozilla Service Worker Docs](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API).
```js
const env = {
  // Environment polyfills
  skipWaiting: Function,
  caches: CacheStorage,
  clients: Clients,
  registration: ServiceWorkerRegistration,
  addEventListener: Function,

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

## Use
The following is an example snippet derived from [__tests__/basic.js](https://github.com/pinterest/pwa/blob/master/packages/service-worker-mock/__tests__/basic.js). The test is based on the [service worker example](https://github.com/GoogleChrome/samples/blob/gh-pages/service-worker/basic/service-worker.js) provided by Google. 

```js
const makeServiceWorkerEnv = require('service-worker-mock');

describe('Service worker', () => {
  it('should delete old caches on activate', async () => {
      Object.assign(global, makeServiceWorkerEnv());
      require('./path/to/sw.js');

      // Create old cache
      await self.caches.open('OLD_CACHE');
      expect(self.snapshot().caches.OLD_CACHE).toBeDefined();

      // Activate and verify old cache is removed
      await self.trigger('activate');
      expect(self.snapshot().caches.OLD_CACHE).toBeUndefined();
  });
});
```



