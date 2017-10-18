// stubs https://developer.mozilla.org/en-US/docs/Web/API/Request
const Body = require('./Body');
const Headers = require('./Headers');
const URL = require('dom-urls');


const DEFAULT_HEADERS = [
  ['accept', '*/*']
];

const throwBodyUsed = () => {
  throw new TypeError('Failed to execute \'clone\': body is already used');
};

class Request extends Body {
  constructor(url, options) {
    super(options ? options.body : undefined, options);
    this.url = ((url instanceof URL) ? url : new URL(url, self.location.href)).href;
    this.method = (options && options.method) || 'GET';
    this.mode = (options && options.mode) || 'same-origin';   // FF defaults to cors
    this.headers = (options && options.headers) || new Headers(DEFAULT_HEADERS);
  }

  clone() {
    if (this.bodyUsed) throwBodyUsed('json');
    return new Request(this.url, {
      method: this.method,
      mode: this.mode,
      headers: this.headers
    });
  }
}

Request.Request = (url, options) => new Request(url, options);

module.exports = Request;
