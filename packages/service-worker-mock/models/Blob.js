// Blob
// https://w3c.github.io/FileAPI/#dom-blob-blob
class Blob {
  constructor(parts = [], options = {}) {
    if (!Array.isArray(parts)) {
      throw new TypeError('Blob requires an array');
    }

    this.parts = parts;
    this.type = options.type || '';
  }

  get size() {
    return this.parts.reduce((size, part) => {
      return size + (part instanceof Blob ? part.size : String(part).length);
    }, 0);
  }

  // Warning: non-standard, but used in other mocks for simplicity.
  get _text() {
    return this.parts.reduce((text, part) => {
      return text + (part instanceof Blob ? part._text : String(part));
    }, '');
  }

  clone() {
    return new Blob(this.parts.slice(), {
      type: this.type
    });
  }

  slice(start, end, type) {
    const bodyString = this._text;
    const slicedBodyString = bodyString.substring(start, end);
    return new Blob([slicedBodyString], { type });
  }
}

module.exports = Blob;
