// stubs https://developer.mozilla.org/en-US/docs/Web/API/Response
const Body = require('./Body');
const Headers = require('./Headers');

const isSupportedBodyType = (body) =>
  (body === null) ||
  (body instanceof Blob) ||
  (typeof body === 'string');

class Response extends Body {
  constructor(body = null, options = {}) {
    if (!isSupportedBodyType(body)) {
      throw new TypeError('Response body must be one of: Blob, USVString, null');
    }
    super(body, options);
    this.status = typeof options.status === 'number'
      ? options.status
      : 200;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = options.statusText || 'OK';

    if (options.headers) {
      if (options.headers instanceof Headers) {
        this.headers = options.headers;
      } else if (typeof options.headers === 'object') {
        this.headers = new Headers(options.headers);
      } else {
        throw new TypeError('Cannot construct response.headers: invalid data');
      }
    } else {
      this.headers = new Headers({});
    }

    this.type = this.status === 0 ? 'opaque' : 'basic';
    this.redirected = false;
    this.url = options.url || 'http://example.com/asset';
    this.method = options.method || 'GET';
  }

  clone() {
    return new Response(this.body, {
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
      url: this.url
    });
  }

  /**
   * Creates a new response with a different URL.
   * @param url The URL that the new response is to originate from.
   * @param status [Optional] An optional status code for the response (e.g., 302.)
   * @returns {Response}
   */
  static redirect(url, status = 302) {
    // see https://fetch.spec.whatwg.org/#dom-response-redirect
    if (![301, 302, 303, 307, 308].includes(status)) {
      throw new RangeError('Invalid status code');
    }
    return new Response(null, {
      status: status,
      headers: { Location: new URL(url).href }
    });
  }

  static error() {
    const errorResponse = new Response(null, {
      url: '',
      headers: {},
      status: 0
    });

    errorResponse.type = 'error';

    return errorResponse;
  }
}

module.exports = Response;
