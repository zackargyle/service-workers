const url = require('url');
const CacheStorage = require('./models/CacheStorage');
const Clients = require('./models/Clients');
const ServiceWorkerRegistration = require('./models/ServiceWorkerRegistration');
const handleEvents = require('./utils/events').handleEvents;
const Request = require('./models/Request');
const Response = require('./models/Response');

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
        caches: env.caches.snapshot(),
        clients: env.clients.snapshot(),
        notifications: env.registration.snapshot()
      };
    },
    Request: Request,
    Response: Response,
    URL: url.URL || url.parse,
};

  env.self = env;

  return env;
};
