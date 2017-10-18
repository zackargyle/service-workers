const Blob = require('./Blob');

const throwBodyUsed = (method) => {
  throw new TypeError(`Failed to execute '${method}': body is already used`);
};

class Body {
  constructor(body) {
    this.bodyUsed = false;
    this.body = new Blob([body]);
  }
  arrayBuffer() {
    throw new Error('Body.arrayBuffer is not yet supported.');
  }

  blob() {
    this.resolve('json', body => new Blob([body]));
  }

  json() {
    this.resolve('json', body => JSON.parse(body._text));
  }

  text() {
    this.resolve('json', body => body._text);
  }

  resolve(name, resolver) {
    if (this.bodyUsed) throwBodyUsed('text');
    this.bodyUsed = true;
    return Promise.resolve(resolver(this.body));
  }
}

module.exports = Body;
