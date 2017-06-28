// stubs https://developer.mozilla.org/en-US/docs/Web/API/Request
class Request {
  constructor(url, options) {
    this.url = url || 'http://example.com/something';
    this.method = (options && options.method) || 'GET';
    this.mode = (options && options.mode) || 'navigate';
  }

  clone() {
    return new Request(this.url, {
      method: this.method,
      mode: this.mode
    });
  }
}

module.exports = Request;
