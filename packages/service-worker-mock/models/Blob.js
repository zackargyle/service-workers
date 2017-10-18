class Blob {
  constructor(parts, options) {
    if (parts && !Array.isArray(parts)) {
      throw new TypeError('Blob requires an array');
    }

    this.parts = parts || [];
    this.type = (options && options.type) || '';
  }

  get size() {
    return this.parts.reduce((size, part) => {
      return size + (part.length || part.size);
    }, 0);
  }

  get text() {
    return this.parts.reduce((text, part) => {
      return text + (typeof part === 'string' ? part : part.text);
    }, '');
  }
}

module.exports = Blob;
