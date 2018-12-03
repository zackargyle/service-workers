// stubs https://developer.mozilla.org/en-US/docs/Web/API/Response
const Body = require('./Body');

const isSupportedBodyType = (body) =>
  (body instanceof Blob) ||
  (typeof body === 'string');

class Response extends Body {
  constructor(body, init) {
    if (!isSupportedBodyType(body)) {
      throw new TypeError('Response requires a Blob or USVString');
    }
    super(body);
    this.status = (init && typeof init.status === 'number') ? init.status : 200;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = (init && init.statusText) || 'OK';
    this.headers = (init && init.headers);

    this.type = this.status === 0 ? 'opaque' : 'basic';
    this.redirected = false;
    this.url = (init && init.url) || 'http://example.com/asset';
  }

  clone() {
    return new Response(this.body, {
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
      url: this.url
    });
  }
}

module.exports = Response;
