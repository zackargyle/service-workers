const URL = require('dom-urls');

const Cache = require('./models/Cache');
const CacheStorage = require('./models/CacheStorage');
const Client = require('./models/Client');
const Clients = require('./models/Clients');
const Event = require('./models/Event');
const FetchEvent = require('./models/FetchEvent');
const Headers = require('./models/Headers');
const Notification = require('./models/Notification');
const NotificationEvent = require('./models/NotificationEvent');
const PushEvent = require('./models/PushEvent');
const PushManager = require('./models/PushManager');
const PushSubscription = require('./models/PushSubscription');
const Request = require('./models/Request');
const Response = require('./models/Response');
const ServiceWorkerRegistration = require('./models/ServiceWorkerRegistration');

const eventHandler = require('./utils/eventHandler');

const defaults = (envOptions) => Object.assign({
  locationUrl: 'https://www.test.com'
}, envOptions);

class ServiceWorkerGlobalScope {
  constructor(envOptions) {
    const options = defaults(envOptions);
    this.listeners = {};
    this.location = new URL(options.locationUrl, options.locationBase);
    this.skipWaiting = () => Promise.resolve();
    this.caches = new CacheStorage();
    this.clients = new Clients();
    this.registration = new ServiceWorkerRegistration();

    // Constructors
    this.Cache = Cache;
    this.Client = Client;
    this.Event = Event;
    this.FetchEvent = FetchEvent;
    this.Headers = Headers;
    this.Notification = Notification;
    this.NotificationEvent = NotificationEvent;
    this.PushEvent = PushEvent;
    this.PushManager = PushManager;
    this.PushSubscription = PushSubscription;
    this.Request = Request;
    this.Response = Response;
    this.ServiceWorkerGlobalScope = ServiceWorkerGlobalScope;
    this.URL = URL;

    // Instance variable to avoid issues with `this`
    this.addEventListener = (name, callback) => {
      if (!this.listeners[name]) {
        this.listeners[name] = [];
      }
      this.listeners[name].push(callback);
    };

    // Instance variable to avoid issues with `this`
    this.trigger = (name, args) => {
      if (this.listeners[name]) {
        return eventHandler(name, args, this.listeners[name]);
      }
      return Promise.resolve();
    };

    // Instance variable to avoid issues with `this`
    this.snapshot = () => {
      return {
        caches: this.caches.snapshot(),
        clients: this.clients.snapshot(),
        notifications: this.registration.snapshot()
      };
    };

    this.self = this;
  }
}

module.exports = function makeServiceWorkerEnv(envOptions) {
  return new ServiceWorkerGlobalScope(envOptions);
};
