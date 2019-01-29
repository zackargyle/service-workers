// If the WHATWG URL implementation is available via the first-party `url`
// module, in Node 7+, then prefer that. Otherwise, fall back on the `dom-urls`
// implementation, which lacks support for the `searchParams` property.
const URL = require('url').URL || require('dom-urls');
const {
  IDBFactory,
  IDBKeyRange,
  IDBDatabase,
  IDBObjectStore,
  reset: resetIDB
} = require('shelving-mock-indexeddb');
const { Performance } = require('w3c-hr-time');

const Blob = require('./models/Blob');
const Body = require('./models/Body');
const Cache = require('./models/Cache');
const CacheStorage = require('./models/CacheStorage');
const Client = require('./models/Client');
const WindowClient = require('./models/WindowClient');
const Clients = require('./models/Clients');
const DOMException = require('./models/DOMException');
const ExtendableEvent = require('./models/ExtendableEvent');
const ExtendableMessageEvent = require('./models/ExtendableMessageEvent');
const Event = require('./models/Event');
const EventTarget = require('./models/EventTarget');
const FetchEvent = require('./models/FetchEvent');
const Headers = require('./models/Headers');
const MessageEvent = require('./models/MessageEvent');
const MessageChannel = require('./models/MessageChannel');
const MessagePort = require('./models/MessagePort');
const Notification = require('./models/Notification');
const NotificationEvent = require('./models/NotificationEvent');
const PushEvent = require('./models/PushEvent');
const PushManager = require('./models/PushManager');
const PushSubscription = require('./models/PushSubscription');
const Request = require('./models/Request');
const Response = require('./models/Response');
const ServiceWorkerRegistration = require('./models/ServiceWorkerRegistration');
const SyncEvent = require('./models/SyncEvent');
const URLSearchParams = require('url-search-params');
const BroadcastChannel = require('./models/BroadcastChannel');
const FileReader = require('./models/FileReader');

const eventHandler = require('./utils/eventHandler');

const defaults = (envOptions) => Object.assign({
  locationUrl: 'https://www.test.com/sw.js',
  userAgent: 'Mock User Agent',
  useRawRequestUrl: false
}, envOptions);

const makeListenersWithReset = (listeners, resetEventListeners) => {
  Object.defineProperty(listeners, 'reset', {
    enumerable: false,
    value: resetEventListeners
  });
  return listeners;
};

class ServiceWorkerGlobalScope extends EventTarget {
  constructor(envOptions) {
    super();

    const options = defaults(envOptions);

    // For backwards compatibility, resetting global scope listeners
    // will reset ExtenableEvents as well
    this.listeners = makeListenersWithReset(this.listeners, () => {
      this.resetEventListeners();
      ExtendableEvent._allExtendableEvents.clear();
    });
    this.useRawRequestUrl = options.useRawRequestUrl;
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
    this.DOMException = DOMException;
    this.Event = Event;
    this.EventTarget = EventTarget;
    this.ExtendableEvent = ExtendableEvent;
    this.ExtendableMessageEvent = ExtendableMessageEvent;
    this.FetchEvent = FetchEvent;
    this.FileReader = FileReader;
    this.Headers = Headers;
    this.importScripts = () => {};
    this.indexedDB = new IDBFactory();
    this.IDBKeyRange = IDBKeyRange;
    this.IDBDatabase = IDBDatabase;
    this.IDBObjectStore = IDBObjectStore;
    this.resetIDB = resetIDB;
    this.MessageEvent = MessageEvent;
    this.MessageChannel = MessageChannel;
    this.MessagePort = MessagePort;
    this.Notification = Notification;
    this.NotificationEvent = NotificationEvent;
    this.PushEvent = PushEvent;
    this.PushManager = PushManager;
    this.PushSubscription = PushSubscription;
    this.performance = new Performance();
    this.Request = Request;
    this.Response = Response;
    this.SyncEvent = SyncEvent;
    this.ServiceWorkerGlobalScope = ServiceWorkerGlobalScope;
    this.URL = URL;
    this.URLSearchParams = URLSearchParams;
    this.navigator = {};
    this.navigator.userAgent = options.userAgent;

    this.WindowClient = WindowClient;

    this.trigger = (name, args) => {
      if (this.listeners.has(name)) {
        return eventHandler(
          name,
          args,
          Array.from(this.listeners.get(name).values())
        );
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
