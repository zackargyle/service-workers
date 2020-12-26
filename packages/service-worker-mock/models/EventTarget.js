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
      // When dispatching messages on another context,
      // we need to transfer event data into the context realm,
      // otherwise `event.data instanceof Object` won't work.
      // TODO: For fetch events we need to transfer the Request
      if (event.type === 'message') {
        if (typeof event.data === 'object') {
          event.data = JSON.parse(JSON.stringify(event.data));
        }
      }
      for (const listener of listeners) {
        listener(event);
      }
    }
  }

  removeEventListener(type, listener) {
    if (this.listeners.has(type)) {
      const set1 = this.listeners.get(type)
      set1.delete(listener);
      this.listeners.set(type, set1);
    }
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
