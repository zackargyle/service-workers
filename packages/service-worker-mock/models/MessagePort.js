const EventTarget = require('./EventTarget');
const MessageEvent = require('./MessageEvent');

class MessagePort extends EventTarget {
  constructor() {
    super();

    this._active = true;
    this._targetPort = null;
    this._onmessage = null;
    this._onmessageerror = null;
    Object.defineProperty(this, 'onmessage', {
      enumerable: true,
      set: (handler) => {
        this._onmessage = handler;
        this.addEventListener('message', handler);
      },
      get: () => this._onmessage
    });
    Object.defineProperty(this, 'onmessageerror', {
      enumerable: true,
      set: (handler) => {
        this._onmessageerror = handler;
        this.addEventListener('messageerror', handler);
      },
      get: () => this._onmessageerror
    });
  }

  /**
   * Posts a message through the channel. Objects listed in transfer are
   * transferred, not just cloned, meaning that they are no longer usable on the sending side.
   * Throws a "DataCloneError" DOMException if
   * transfer contains duplicate objects or port, or if message
   * could not be cloned.
   * TODO: Implement Transferable
   */
  postMessage(message /* , transfer?: Transferable[] */) {
    const event = new MessageEvent('message', {
      data: message
    });
    this._targetPort.dispatchEvent(event);
  }


  close() {
    // not implemented yet
  }

  start() {
    // not implemented yet
  }
}

module.exports = MessagePort;
