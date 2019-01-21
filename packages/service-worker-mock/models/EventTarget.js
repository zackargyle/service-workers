class EventTarget {
  constructor() {
    this.listeners = new Map();
  }

  addEventListener(type, listener /* TODO: support `opts` */) {
    if (this.listeners.has(type)) {
      this.listeners.get(type).add(listener);
    } else {
      this.listeners.set(type, createExtendedSet([listener]));
    }
  }

  dispatchEvent(event) {
    const listeners = this.listeners.get(event.type);

    if (listeners) {
      for (const listener of listeners) {
        listener(event);
      }
    }
  }

  removeEventListener() {
    throw new Error('not implemented yet');
  }

  resetEventListeners() {
    this.listeners.clear();
  }

}

const createExtendedSet = (values) => {
  const set = new Set(values);

  Object.defineProperty(set, 'at', {
    enumerable: false,
    value: function (pos) {
      return Array.from(this.values())[pos];
    }
  });

  return set;
};

module.exports = EventTarget;
