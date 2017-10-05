Service Worker Plugin
=========================
A webpack plugin for generating dynamic service worker files and a runtime helper.

## Why?
There are several other popular service worker plugins out there ([offline-plugin](https://github.com/NekR/offline-plugin/), etc), but they focus only on caching, and are not testable or easy to experiment with. Service workers also include support for other tools like notifications and homescreen installs. This plugin attempts to account for a wider variety of configurable options by utilizing [generate-service-worker](https://github.com/pinterest/service-workers/tree/master/packages/generate-service-worker).

ServiceWorkerPlugin will generate any number of service workers, and provide a runtime file for dynamically registering whichever service worker you want. **This is perfect for experimenting with different caching strategies, or rolling out service worker changes.** In a webpack world where all of our files are hashed and dynamically generated, being able to experiment with precaching and runtime caching approaches is incredibly important. The runtime file makes it particularly easy to utilize your own experiment framework alongside the generated experimental service worker files if you can statically host the service workers.

## Use

```js
const ServiceWorkerPlugin = require('service-worker-plugin');

const rootConfig = {
  cache: {
    offline: true,
    precache: ['\\.js'],
    strategy: [{
      type: 'prefer-cache',
      matches: ['\\.js']
    }]
  }
};

module.exports = {
  entry: "./entry.js",
  output: {
    publicPath: '/static',
  },
  plugins: [
    new ServiceWorkerPlugin(rootConfig, {
      experiment_with_notifications: Object.assign({}, rootConfig, {
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
    })
  ]
};

// Registering the service worker in your browser bundle
const runtime = require('service-worker-plugin/runtime');
if (inPrecacheExperiment) {
  runtime.register('experiment_with_notifications');
} else {
  runtime.register();
}
```

## Configurations
ServiceWorkerPlugin has the following configuration options.

Option key      | description
--------------- | -----------
`publicPath`    | The path to your hosted precache assets (ie. '/static/js/')
`writePath`     | The path to where the plugin should write the files to disk
`runtimePath`   | The path to your hosted service workers (ie. '/')
`cache`         |
`notifications` |

### Caching
The `cache` key is used for defining caching strategies. The regexes in `precache` will be used to resolve webpack-generated assets to hard-coded paths for precaching. The regexes in `strategy.matches` are used at runtime to determine which strategy to use for a given GET request. All cached items will be removed at installation of a new service worker version. Additionally, you can use your own custom cache template by including the full path in the `template` property. We suggest forking our `templates/cache.js` file to get started and to be familiar with how variable injection works in the codebase. If the `offline` option is set to `true`, the service worker will assume that an html response is an "App Shell". It will cache the html response and return it only in the case of a static route change while offline.
```js
const CacheType = {
  offline?: boolean,
  precache?: Array<regex>,
  strategy?: Array<StrategyType>,
  template?: string,
};
const StrategyType = {
  type: 'offline-only' | 'fallback-only' | 'prefer-cache' | 'race',
  matches: Array<regex>,
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
The `notifications` key is used for including browser notification events in your service worker. To enable the notifications in your app, you can call `runtime.requestNotificationsPermission()` from the generated runtime file. The backend work is not included. You will still need to push notifications to your provider and handle registration. Additionally, you can use your own custom notifications template by including the full path in the `template` property. We suggest forking our `templates/notifications.js` file to get started and to be familiar with how variable injection works in the codebase.
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
  duration?: number,
  template?: string,
});

```

### Event Logging
The `log` key is used for defining which service worker events your API wants to know about. Each `string` should be a valid url path that will receive a 'GET' request for the corresponding event.
```js
const LogType = {
  notificationClicked?: string,
  notificationShown?: string,
};
```

## License

MIT
