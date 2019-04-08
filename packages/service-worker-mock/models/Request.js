// stubs https://developer.mozilla.org/en-US/docs/Web/API/Request
const Body = require('./Body');
const Headers = require('./Headers');
const URL = require('url').URL || require('dom-urls');


const DEFAULT_HEADERS = {
  accept: '*/*'
};

const throwBodyUsed = () => {
  throw new TypeError('Failed to execute \'clone\': body is already used');
};

class Request extends Body {
  constructor(urlOrRequest, options = {}) {
    let url = urlOrRequest;
    if (urlOrRequest instanceof Request) {
      url = urlOrRequest.url;
      options = Object.assign({}, {
        body: urlOrRequest.body,
        credentials: urlOrRequest.credentials,
        headers: urlOrRequest.headers,
        method: urlOrRequest.method,
        mode: urlOrRequest.mode,
        referrer: urlOrRequest.referrer
      }, options);
    } else if (typeof url === 'string' && url.length === 0) {
      url = '/';
    }

    if (!url) {
      throw new TypeError(`Invalid url: ${urlOrRequest}`);
    }

    super(options.body, options);

    if (url instanceof URL) {
      this.url = url.href;
    } else if (self.useRawRequestUrl) {
      this.url = url;
    } else {
      this.url = new URL(url, self.location.href).href;
    }

    this.method = options.method || 'GET';
    this.mode = options.mode || 'same-origin';   // FF defaults to cors
    this.referrer = options.referrer && options.referrer !== 'no-referrer' ? options.referrer : '';
    // See https://fetch.spec.whatwg.org/#concept-request-credentials-mode
    this.credentials = options.credentials || (this.mode === 'navigate'
      ? 'include'
      : 'omit');

    // Transform options.headers to Headers object
    if (options.headers) {
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
    if (this.bodyUsed) {
      throwBodyUsed();
    }

    return new Request(this.url, {
      method: this.method,
      mode: this.mode,
      headers: this.headers,
      body: this.body ? this.body.clone() : this.body
    });
  }
}

Request.Request = (url, options) => new Request(url, options);

module.exports = Request;
