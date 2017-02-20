const CacheStorage = require('./models/CacheStorage');
const Clients = require('./models/Clients');
const ServiceWorkerRegistration = require('./models/ServiceWorkerRegistration');
const handleEvents = require('./events').handleEvents;

module.exports = function makeServiceWorkerEnv() {
  const env = {
    listeners: {},
    location: { origin: '/' },
    skipWaiting: () => Promise.resolve(),
    caches: new CacheStorage(),
    clients: new Clients(),
    registration: new ServiceWorkerRegistration(),
    addEventListener: function (name, callback) {
      if (!env.listeners[name]) {
        env.listeners[name] = [];
      }
      env.listeners[name].push(callback);
    },
    trigger: function (name, args) {
      if (env.listeners[name]) {
        return handleEvents(name, args, env.listeners[name]);
      }
      return Promise.resolve();
    },
    snapshot: function () {
      return {
        cache: env.caches.$snapshot(),
        clients: env.clients.$snapshot(),
        registration: env.registration.$snapshot(),
        listeners: Object.keys(env.listeners).reduce((obj, key) => {
          obj[key] = env.listeners[key].length;
          return obj;
        }, {})
      };
    }
  };

  env.self = env;

  return env;
};
