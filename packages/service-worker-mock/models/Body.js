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
    if (this.bodyUsed) throwBodyUsed("arrayBuffer");
    this.bodyUsed = true;

    if ("arrayBuffer" in this.body) {
      return this.body.arrayBuffer();
    }

    return (
      new Promise((resolve) => {
        const fr = new FileReader();
        fr.onload = () => {
          resolve(fr.result);
        };
        fr.readAsArrayBuffer(
          "parts" in this.body
            ? (this.body).parts[0]
            : this.body
        );
      })
    );
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
