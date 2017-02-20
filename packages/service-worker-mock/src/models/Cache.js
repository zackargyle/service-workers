// https://developer.mozilla.org/en-US/docs/Web/API/Cache
class Cache {
  constructor() {
    this.store = new Map();
  }

  match(request) {
    if (this.store.has(request)) {
      return Promise.resolve(this.store.get(request)[0]);
    }
    return Promise.resolve(null);
  }

  matchAll(request) {
    if (this.store.has(request)) {
      return Promise.resolve(this.store.get(request));
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
    if (this.store.has(request)) {
      this.store.get(request).push(response);
    } else {
      this.store.set(request, [response]);
    }
    return Promise.resolve();
  }

  delete(request) {
    if (this.store.has(request)) {
      this.store.delete(request);
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  keys() {
    return Promise.resolve(this.store.keys());
  }

  snapshot() {
    const entries = this.store.entries();
    const snapshot = {};
    for (const entry of entries) {
      let key = entry[0];
      if (typeof entry[0] === 'object') {
        key = JSON.stringify(key);
      }
      snapshot[key] = entry[1][0];
    }
    return snapshot;
  }
}

module.exports = Cache;
