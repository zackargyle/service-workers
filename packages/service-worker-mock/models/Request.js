// stubs https://developer.mozilla.org/en-US/docs/Web/API/Request
const Headers = require('./Headers');
const URL = require('dom-urls');

const DEFAULT_HEADERS = [
  ['accept', '*/*']
];

class Request {
  constructor(url, options) {
    this.url = ((url instanceof URL) ? url : new URL(url, self.location.href)).href;
    this.method = (options && options.method) || 'GET';
    this.mode = (options && options.mode) || 'same-origin';   // FF defaults to cors
    this.headers = (options && options.headers) || new Headers(DEFAULT_HEADERS);
  }

  clone() {
    return new Request(this.url, {
      method: this.method,
      mode: this.mode,
      headers: this.headers
    });
  }
}

module.exports = Request;
