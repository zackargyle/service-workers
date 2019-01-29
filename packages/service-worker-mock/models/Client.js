const generateRandomId = require('../utils/generateRandomId');
const EventTarget = require('./EventTarget');
const MessageEvent = require('./MessageEvent');
const MessagePort = require('./MessagePort');

// https://developer.mozilla.org/en-US/docs/Web/API/Client
class Client extends EventTarget {
  constructor(url, type, frameType) {
    super();

    this.id = generateRandomId();
    this.url = url;
    this.type = type || 'worker';
    this.frameType = frameType;
  }

  // TODO: Implement Transferable
  postMessage(message, transfer = []) {
    const ports = transfer.filter(objOrPort => (objOrPort instanceof MessagePort));
    const event = new MessageEvent('message', {
      data: message,
      ports
    });
    this.dispatchEvent(event);
  }

  snapshot() {
    return {
      url: this.url,
      type: this.type,
      frameType: this.frameType
    };
  }
}

module.exports = Client;
