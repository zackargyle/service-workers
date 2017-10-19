const Cache = require('./Cache');

// https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage
class CacheStorage {
  constructor() {
    this.caches = {};
  }

  match(request) {
    const url = request.url || request;
    const keys = Object.keys(this.caches);
    for (let i = 0; i < keys.length; i += 1) {
      const cache = this.caches[keys[i]];
      if (cache.store.has(url)) {
        return cache.match(request);
      }
    }
    return Promise.resolve(null);
  }

  has(cacheName) {
    return Promise.resolve(this.caches.hasOwnProperty(cacheName));
  }

  open(name) {
    if (!this.caches[name]) {
      this.caches[name] = new Cache();
    }
    return Promise.resolve(this.caches[name]);
  }

  delete(cacheName) {
    if (this.caches.hasOwnProperty(cacheName)) {
      delete this.caches[cacheName];
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  keys() {
    return Promise.resolve(Object.keys(this.caches));
  }

  snapshot() {
    return Object.keys(this.caches).reduce((obj, key) => {
      obj[key] = this.caches[key].snapshot();
      return obj;
    }, {});
  }

  reset() {
    this.caches = {};
  }
}

module.exports = CacheStorage;
