// If the WHATWG URL implementation is available via the first-party `url`
// module, in Node 7+, then prefer that. Otherwise, fall back on the `dom-urls`
// implementation, which lacks support for the `searchParams` property.
const URL = require('url').URL || require('dom-urls');
const {
  IDBFactory,
  IDBKeyRange,
  IDBDatabase,
  IDBObjectStore
} = require('shelving-mock-indexeddb');

const Blob = require('./models/Blob');
const Body = require('./models/Body');
const Cache = require('./models/Cache');
const CacheStorage = require('./models/CacheStorage');
const Client = require('./models/Client');
const WindowClient = require('./models/WindowClient');
const Clients = require('./models/Clients');
const ExtendableEvent = require('./models/ExtendableEvent');
const Event = require('./models/Event');
const { createListeners } = require('./models/event-listeners');
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
const MessageEvent = require('./models/MessageEvent');
const SyncEvent = require('./models/SyncEvent');
const URLSearchParams = require('url-search-params');
const BroadcastChannel = require('./models/BroadcastChannel');
const FileReader = require('./models/FileReader');

const eventHandler = require('./utils/eventHandler');

const defaults = (envOptions) => Object.assign({
  locationUrl: 'https://www.test.com',
  userAgent: 'Mock User Agent'
}, envOptions);

const makeListenersWithReset = (listeners, resetEventListeners) => {
  Object.defineProperty(listeners, 'reset', {
    enumerable: false,
    value: resetEventListeners
  });
  return listeners;
};

class ServiceWorkerGlobalScope {
  constructor(envOptions) {
    const options = defaults(envOptions);
    const {
      addEventListener,
      dispatchEvent,
      resetEventListeners,
      _listenerMap
    } = createListeners();

    this.listeners = makeListenersWithReset(_listenerMap, resetEventListeners);
    this.location = new URL(options.locationUrl, options.locationBase);
    this.skipWaiting = () => Promise.resolve();
    this.caches = new CacheStorage();
    this.clients = new Clients();
    this.registration = new ServiceWorkerRegistration();

    // Constructors
    this.Blob = Blob;
    this.Body = Body;
    this.BroadcastChannel = BroadcastChannel;
    this.Cache = Cache;
    this.Client = Client;
    this.Event = Event;
    this.ExtendableEvent = ExtendableEvent;
    this.FetchEvent = FetchEvent;
    this.FileReader = FileReader;
    this.Headers = Headers;
    this.importScripts = () => {};
    this.indexedDB = new IDBFactory();
    this.IDBKeyRange = IDBKeyRange;
    this.IDBDatabase = IDBDatabase;
    this.IDBObjectStore = IDBObjectStore;
    this.MessageEvent = MessageEvent;
    this.Notification = Notification;
    this.NotificationEvent = NotificationEvent;
    this.PushEvent = PushEvent;
    this.PushManager = PushManager;
    this.PushSubscription = PushSubscription;
    this.Request = Request;
    this.Response = Response;
    this.SyncEvent = SyncEvent;
    this.ServiceWorkerGlobalScope = ServiceWorkerGlobalScope;
    this.URL = URL;
    this.URLSearchParams = URLSearchParams;
    this.navigator = {};
    this.navigator.userAgent = options.userAgent;

    this.WindowClient = WindowClient;

    this.addEventListener = addEventListener;

    this.trigger = (name, args) => {
      if (this.listeners.has(name)) {
        return eventHandler(
          name,
          args,
          Array.from(_listenerMap.get(name).values())
        );
      }
      return Promise.resolve();
    };
    this.dispatchEvent = dispatchEvent;

    // Instance variable to avoid issues with `this`
    this.snapshot = () => {
      return {
        caches: this.caches.snapshot(),
        clients: this.clients.snapshot(),
        notifications: this.registration.snapshot()
      };
    };

    // Allow resetting without rewriting
    this.resetSwEnv = () => {
      this.caches.reset();
      this.clients.reset();
      this.listeners.reset();
    };

    this.self = this;
  }
}

module.exports = function makeServiceWorkerEnv(envOptions) {
  return new ServiceWorkerGlobalScope(envOptions);
};
