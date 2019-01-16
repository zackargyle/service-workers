const Blob = require('./Blob');

const throwBodyUsed = (method) => {
  throw new TypeError(`Failed to execute '${method}': body is already used`);
};

class Body {
  constructor(body) {
    this.bodyUsed = false;
    this.body = body === null || body instanceof Blob ? body : new Blob([].concat(body));
  }
  arrayBuffer() {
    throw new Error('Body.arrayBuffer is not yet supported.');
  }

  blob() {
    return this.resolve('blob', body => body);
  }

  json() {
    return this.resolve('json', body => JSON.parse(body._text));
  }

  text() {
    return this.resolve('text', body => body._text);
  }

  resolve(name, resolver) {
    if (this.bodyUsed) throwBodyUsed(name);
    this.bodyUsed = true;
    return Promise.resolve(resolver(this.body));
  }
}

module.exports = Body;
