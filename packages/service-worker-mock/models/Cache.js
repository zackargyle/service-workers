// https://developer.mozilla.org/en-US/docs/Web/API/Cache
class Cache {
  constructor() {
    this.store = new Map();
  }

  match(request) {
    const url = request.url || request;
    if (this.store.has(url)) {
      return Promise.resolve(this.store.get(url));
    }
    return Promise.resolve(null);
  }

  matchAll(request) {
    const url = request.url || request;
    if (this.store.has(url)) {
      return Promise.resolve([this.store.get(url)]);
    }
    return Promise.resolve(null);
  }

  add(request) {
    return fetch(request).then(response => {
      return this.put(request, response);
    });
  }

  addAll(requests) {
    return Promise.all(requests.map(request => {
      return this.add(request);
    }));
  }

  put(request, response) {
    const url = request.url || request;
    this.store.set(url, response);
    return Promise.resolve();
  }

  delete(request) {
    const url = request.url || request;
    return Promise.resolve(this.store.delete(url));
  }

  keys() {
    return Promise.resolve(Array.from(this.store.values()));
  }

  snapshot() {
    const entries = this.store.entries();
    const snapshot = {};
    for (const entry of entries) {
      let key = entry[0];
      if (typeof entry[0] === 'object') {
        key = JSON.stringify(key);
      }
      snapshot[key] = entry[1];
    }
    return snapshot;
  }
}

module.exports = Cache;
