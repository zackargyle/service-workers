// stubs https://developer.mozilla.org/en-US/docs/Web/API/Headers

class Headers {
  constructor(meta) {
    if (meta && meta instanceof Headers) {
      this._map = new Map(meta._map);
    } else if (meta && typeof meta === 'object') {
      const iterable = Object.keys(meta).map(key => ([key, meta[key]]));
      this._map = new Map(iterable);
    } else {
      this._map = new Map();
    }
  }

  append(name, value) {
    if (this._map.has(name)) {
      value = `${this._map.get(name)},${value}`;
    }
    this._map.set(name, value);
  }

  delete(name) {
    this._map.delete(name);
  }

  entries() {
    return this._map.entries();
  }

  get(name) {
    return this._map.get(name) || '';
  }

  has(name) {
    return this._map.has(name);
  }

  keys() {
    return this._map.keys();
  }

  set(name, value) {
    this._map.set(name, value);
  }

  values() {
    return this._map.values();
  }

  [Symbol.iterator]() {
    return this._map.values();
  }
}

Headers.Headers = (meta) => new Headers(meta);

module.exports = Headers;
