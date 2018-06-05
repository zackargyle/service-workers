const generateRandomId = require('../utils/generateRandomId');

// https://developer.mozilla.org/en-US/docs/Web/API/Client
class Client {
  constructor(url, frameType) {
    this.id = generateRandomId();
    this.url = url;
    this.frameType = frameType;
  }

  postMessage() {
    throw new Error('METHOD NOT IMPLEMENTED');
  }

  snapshot() {
    return {
      url: this.url,
      frameType: this.frameType
    };
  }
}

module.exports = Client;
