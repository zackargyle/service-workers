// stubs https://developer.mozilla.org/en-US/docs/Web/API/Response
class Response {
  constructor(body, init) {
    this.body = body;
    this.status = (init && init.status) || 200;
    this.statusText = (init && init.statusText) || 'OK';
    this.headers = (init && init.headers);

    this.type = 'basic';
  }

  clone() {
    return new Response(this.body, {
      status: this.status,
      statusText: this.statusText,
      headers: this.headers
    });
  }
}

module.exports = Response;
