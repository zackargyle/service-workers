Generate Service Worker
=========================
A node module for generating service worker files based on provided configuration options.

## Why?
There are several other popular service worker generators out there ([sw-precache](https://github.com/GoogleChrome/sw-precache), etc), but they focus only on the caching aspect of service workers. Service workers also include support for other tools like notifications and homescreen installs. This generator attempts to account for a wider variety of configurable options.

GenerateServiceWorker supports generating a service worker with a root configuration, and any number of other service workers that extend the functionality of the root config. **This is perfect for experimenting with different caching strategies, or rolling out service worker changes.** The runtime file generated by [progressive-webapp-plugin](https://github.com/pinterest/pwa/tree/master/packages/progressive-webapp-plugin) makes it particularly easy to utilize your own experiment framework alongside the generated experimental service worker files.

## Use

```js
const generateServiceWorkers = require('generate-service-worker');

const serviceWorkers = generateServiceWorkers({
  version: '1.0.0',
}, {
  'experiment_with_cache': {
    cache: {...},
  },
  'experiment_with_notifications': {
    notifications: {...},
  }
});
```

## Configurations
GenerateServiceWorker currently supports caching and notifications. The following are the configuration options for each. 

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
```js
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