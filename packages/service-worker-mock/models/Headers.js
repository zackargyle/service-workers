// stubs https://developer.mozilla.org/en-US/docs/Web/API/Headers

class Headers {
  constructor(meta) {
    if (meta && meta instanceof Headers) {
      this._map = new Map(meta._map);
    } else if (meta && typeof meta === 'object') {
      this._map = new Map(Object.entries(meta));
    } else {
      this._map = new Map();
    }
  }

  append(name, value) {
    if (this._map.has(name.toLowerCase())) {
      value = `${this._map.get(name.toLowerCase())},${value}`;
    }
    this._map.set(name.toLowerCase(), value);
  }

  delete(name) {
    this._map.delete(name.toLowerCase());
  }

  entries() {
    return this._map.entries();
  }

  forEach(callback) {
    return this._map.forEach(callback);
  }

  get(name) {
    return this._map.has(name.toLowerCase()) ? this._map.get(name.toLowerCase()) : null;
  }

  has(name) {
    return this._map.has(name.toLowerCase());
  }

  keys() {
    return this._map.keys();
  }

  set(name, value) {
    this._map.set(name.toLowerCase(), value);
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
