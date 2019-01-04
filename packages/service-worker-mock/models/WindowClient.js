const Client = require('./Client');

// https://developer.mozilla.org/en-US/docs/Web/API/WindowClient
class WindowClient extends Client {
  constructor(...args) {
    super(...args);

    this.type = 'window';
    this.focused = false;
  }

  focus() {
    this.focused = true;
    return Promise.resolve(this);
  }

  navigate(url) {
    this.url = url;
    return Promise.resolve(this);
  }
}

module.exports = WindowClient;
