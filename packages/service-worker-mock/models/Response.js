// stubs https://developer.mozilla.org/en-US/docs/Web/API/Response
class Response {
  constructor(body, init) {
    this.body = body || '';
    this.status = (init && typeof init.status === 'number') || 200;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = (init && init.statusText) || 'OK';
    this.headers = (init && init.headers);

    this.type = 'basic';
    this.redirected = false;
    this.url = 'http://example.com/asset';
  }

  clone() {
    return new Response(this.body, {
      status: this.status,
      statusText: this.statusText,
      headers: this.headers
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
