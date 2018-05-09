const generateRandomId = require('../utils/generateRandomId');

// https://developer.mozilla.org/en-US/docs/Web/API/Client
class Client {
  constructor(url, options) {
    this.id = generateRandomId();
    this.url = url;
    this.frameType = options ? options.frameType : undefined;
    if (options && options.postMessageCallback) {
      this.postMessageCallback = options.postMessageCallback;
    } else {
      this.postMessageCallback = message => { console.log(message); };
    }
  }

  postMessage(message) {
    this.postMessageCallback(message);
  }

  snapshot() {
    return {
      url: this.url,
      frameType: this.frameType
    };
  }
}

module.exports = Client;
