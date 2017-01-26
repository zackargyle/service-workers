'use-strict';
const RESOLVED = 'RESOLVE';
const REJECTED = 'REJECTED';

/**
 * This is a synchronous Promise mock that should only be used
 * for testing purposes.
 */
function MockPromise(resolver) {
  resolver(this.resolve.bind(this), this.reject.bind(this));
}

MockPromise.resolve = function(data) {
  return new MockPromise(resolve => resolve(data));
};

MockPromise.prototype.resolve = function(result) {
  this.resolution = RESOLVED;
  this.result = result;
  return this;
};

MockPromise.prototype.reject = function(result) {
  this.resolution = REJECTED;
  this.result = result;
  return this;
};

MockPromise.prototype.then = function(resolve, reject) {
  if (this.resolution === RESOLVED) {
    if (resolve) {
      this.result = resolve(this.result);
    }
  } else if (reject) {
    this.result = reject(this.result);
  }
  return this;
};

MockPromise.prototype.catch = function(error) {
  this.resolution = REJECTED;
  this.result = error;
  return this;
};

module.exports = MockPromise;
