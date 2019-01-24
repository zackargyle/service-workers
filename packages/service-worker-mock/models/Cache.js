// https://developer.mozilla.org/en-US/docs/Web/API/Cache
class Cache {
  constructor() {
    this.store = new Map();
  }

  match(request) {
    const url = request.url || request;
    if (this.store.has(url)) {
      const value = this.store.get(url);
      return Promise.resolve(value.response);
    }
    return Promise.resolve(null);
  }

  matchAll(request) {
    const url = request.url || request;
    if (this.store.has(url)) {
      const value = this.store.get(url);
      return Promise.resolve([value.response]);
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
    if (typeof request === 'string') {
      let relativeUrl = request;
      request = new Request(request);
      // Add relative url as well (non-standard)
      this.store.set(relativeUrl, { request, response });
    }

    this.store.set(request.url, { request, response });
    return Promise.resolve();
  }

  delete(request) {
    const url = request.url || request;
    return Promise.resolve(this.store.delete(url));
  }

  // https://w3c.github.io/ServiceWorker/#dom-cache-keys
  keys(request, options = {}) {
    let req = null;
    if (request instanceof Request) {
      req = request;
      if (request.method !== 'GET' && !options.ignoreMethod) {
        return Promise.resolve([]);
      }
    } else if (typeof request === 'string') {
      try {
        req = new Request(request);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    const values = Array.from(this.store.values());

    if (req) {
      return Promise.resolve(values
        .filter((value) => {
          return value.request.url === req.url;
        })
        .map((value) => value.request)
      );
    }

    return Promise.resolve(values.map((value) => value.request));
  }

  snapshot() {
    const entries = this.store.entries();
    const snapshot = {};
    for (const entry of entries) {
      let key = entry[0];
      if (typeof entry[0] === 'object') {
        key = JSON.stringify(key);
      }
      snapshot[key] = entry[1].response;
    }
    return snapshot;
  }

  reset() {
    this.store = new Map();
  }
}

module.exports = Cache;
