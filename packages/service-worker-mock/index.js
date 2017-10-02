const url = require('url');
const CacheStorage = require('./models/CacheStorage');
const Clients = require('./models/Clients');
const ServiceWorkerRegistration = require('./models/ServiceWorkerRegistration');
const handleEvents = require('./utils/events').handleEvents;
const Request = require('./models/Request');
const Response = require('./models/Response');

class ServiceWorkerGlobalScope {
  constructor() {
    this.listeners = {};
    this.location = { origin: '/' };
    this.skipWaiting = () => Promise.resolve();
    this.caches = new CacheStorage();
    this.clients = new Clients();
    this.registration = new ServiceWorkerRegistration();
    this.Request = Request;
    this.Response = Response;
    this.URL = url.URL || url.parse;
    this.ServiceWorkerGlobalScope = ServiceWorkerGlobalScope;

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
        return handleEvents(name, args, this.listeners[name]);
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

module.exports = function makeServiceWorkerEnv() {
  return new ServiceWorkerGlobalScope();
};
