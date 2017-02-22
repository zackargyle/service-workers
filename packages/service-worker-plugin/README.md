Service Worker Plugin
=========================
A webpack plugin for generating dynamic service worker files and a runtime helper.

## Why?
There are several other popular service worker plugins out there ([offline-plugin](https://github.com/NekR/offline-plugin/), etc), but they focus only on the caching aspect of service workers. Service workers also include support for other tools like notifications and homescreen installs. This plugin attempts to account for a wider variety of configurable options by utilizing [generate-service-worker](https://github.com/pinterest/service-workers/tree/master/packages/generate-service-worker).

ServiceWorkerPlugin will generate any number of service workers, and provide a runtime function for dynamically registering whichever service worker you want. **This is perfect for experimenting with different caching strategies, or rolling out service worker changes.** In a webpack world where all of our files are hashed and dynamically generated, being able to experiment with precaching and runtime caching approaches is incredibly important. The runtime file makes it particularly easy to utilize your own experiment framework alongside the generated experimental service worker files.

## Use

```js
const ServiceWorkerPlugin = require('service-worker-plugin');

module.exports = {
  entry: "./entry.js",
  output: {
    publicPath: '/static',
  },
  plugins: [
    new ServiceWorkerPlugin({
      cache: {
        precache: ['\\.js'],
        strategy: [{
          type: 'prefer-cache',
          matches: ['\\.js']
        }],
      },
      notifications: {
        default: {
          title: 'Pinterest',
          body: 'You\'ve got new Pins!'
        }
      },
      log: {
        notificationClicked: '/api/notifications/web/click/'
      }
    })
  ]
};

// Registering the service worker in your browser bundle
const runtime = require('service-worker-plugin/runtime');
if (inPrecacheExperiment) {
  runtime.register('experiment_with_precache');
} else if (inRuntimeCacheExperiment) {
  runtime.register('experiment_with_runtime_cache');
}
```

## Configurations
ServiceWorkerPlugin currently supports caching and notifications. The following are the configuration options for each.

### Caching
The `cache` key is used for defining caching strategies. The regexes in `precache` will be used to resolve webpack-generated assets to hard-coded paths for precaching. The regexes in `strategy.matches` is used at runtime to determine which strategy to use for a given GET request. All cached items will be removed at installation of a new service worker version, unless marked `keepAlive: true` is set. This should only be used for static assets like images or some other immutable CDN assets.
```js
const CacheType = {
  precache?: Array<regex>,
  strategy?: Array<StrategyType>,
};
const StrategyType = {
  type: 'offline-only' | 'fallback-only' | 'prefer-cache' | 'race',
  matches: Array<regex>,
  keepAlive?: boolean
};
```

### Strategy Types
strategy        | description
--------------- | -----------
`offline-only`  | Only serve from cache if browser is offline.
`fallback-only` | Only serve from cache if fetch returns an error status (>= 400)
`prefer-cache`  | Always pull from cache if data is available
`race`          | Pull from cache and make fetch request. Whichever returns first should be used. (Good for some low-end phones)


### Notifications
The `notifications` key is used for including browser notification events in your service worker. To enable the notifications, you should call `runtime.requestNotificationsPermission()` from the generated runtime file. The backend work is not included. You will still need to push notifications to GCM, and include your `gcm_sender_id` in your `manifest.json`. This will tell Chrome where to get notifications from.
```js
const NotificationsType = {
  default: {
    title: string,
    body?: string,
    icon?: string,
    tag?: string,
    data?: {
      url: string
    }
  },
  duration?: number
});

```

### Event Logging
The `log` key is used for defining which service worker events your API wants to know about. Each `string` should be a valid url path that will receive a 'GET' request for the corresponding event.
```js
const LogType = {
  installed?: string,
  notificationClicked?: string,
  notificationShown?: string,
  requestOptions?: object
};
```

## License

MIT
