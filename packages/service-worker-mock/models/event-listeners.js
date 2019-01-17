// Derived from https://github.com/GoogleChrome/workbox

const ExtendableEvent = require('./ExtendableEvent');

function createListeners() {
  let _listenerMap = new Map();
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

  const addEventListener = (type, listener /* TODO: support `opts` */) => {
    if (_listenerMap.has(type)) {
      _listenerMap.get(type).add(listener);
    } else {
      _listenerMap.set(type, createExtendedSet([listener]));
    }
  };

  const dispatchEvent = (event) => {
    const listeners = _listenerMap.get(event.type);

    if (listeners) {
      for (const listener of listeners) {
        listener(event);
      }
    }
  };

  const resetEventListeners = () => {
    _listenerMap.clear();
    ExtendableEvent._allExtendableEvents.clear();
  };

  return {
    addEventListener,
    dispatchEvent,
    resetEventListeners,
    _listenerMap
  };
}

module.exports = {
  createListeners
};
