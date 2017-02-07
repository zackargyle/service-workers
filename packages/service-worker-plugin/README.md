Service Worker Plugin
=========================
A webpack plugin for generating dynamic service worker files and a runtime helper.

## Why?
There are several other popular service worker plugins out there ([offline-plugin](https://github.com/NekR/offline-plugin/), etc), but they focus only on the caching aspect of service workers. Service workers also include support for other tools like notifications and homescreen installs. This plugin attempts to account for a wider variety of configurable options by utilizing [generate-service-worker](https://github.com/pinterest/pwa/tree/master/packages/generate-service-worker).

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
    new ServiceWorkerPlugin({ debug: true }, {
      'experiment_with_precache': {
        debug: true,
        cache: {
          precache: [...],
        },
      },
      'experiment_with_runtime_cache': {
        debug: true,
        cache: {
          strategy: [{...}, {...}],
        },
      },
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

### Notifications Type
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
  fetchData?: {
    url: string,
    requestOptions?: object,
  },
  logClick?: {
    url: string,
    requestOptions?: object,
  },
  duration?: number
});

```

### Cache Type
```
const StrategyType = {
  type: 'offline-only' | 'fallback-only' | 'prefer-cache' | 'race',
  matches: string | Array<string>,
  requestOptions?: object
};

const CacheType = {
  precache: Array<string>,
  strategy: StrategyType | Array<StrategyType>,
};
```
