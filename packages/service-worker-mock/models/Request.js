// stubs https://developer.mozilla.org/en-US/docs/Web/API/Request
const Body = require('./Body');
const Headers = require('./Headers');
const URL = require('dom-urls');


const DEFAULT_HEADERS = {
  accept: '*/*'
};

const throwBodyUsed = () => {
  throw new TypeError('Failed to execute \'clone\': body is already used');
};

class Request extends Body {
  constructor(url, options) {
    super(options ? options.body : undefined, options);
    this.url = ((url instanceof URL) ? url : new URL(url, self.location.href)).href;
    this.method = (options && options.method) || 'GET';
    this.mode = (options && options.mode) || 'same-origin';   // FF defaults to cors
    this.cache = (options && options.cache) || 'default';

    // Transform options.headers to Headers object
    if (options && options.headers) {
      if (options.headers instanceof Headers) {
        this.headers = options.headers;
      } else if (typeof options.headers === 'object') {
        this.headers = new Headers(options.headers);
      } else {
        throw new TypeError('Cannot construct request.headers: invalid data');
      }
    } else {
      this.headers = new Headers(DEFAULT_HEADERS);
    }
  }

  clone() {
    if (this.bodyUsed) throwBodyUsed();
    return new Request(this.url, {
      method: this.method,
      mode: this.mode,
      headers: this.headers
    });
  }
}

Request.Request = (url, options) => new Request(url, options);

module.exports = Request;
