// stubs https://developer.mozilla.org/en-US/docs/Web/API/Response
const Body = require('./Body');
const Blob = require('./Blob');

class Response extends Body {
  constructor(body, init) {
    if (typeof body === 'object' && !(body instanceof Blob)) {
      body = JSON.stringify(body);
    } else if (typeof body !== 'object') {
      body = undefined;
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

  text() {
    try {
      return Promise.resolve(this.body.toString());
    } catch (err) {
      return Promise.resolve(Object.prototype.toString.apply(this.body));
    }
  }
}

module.exports = Response;
