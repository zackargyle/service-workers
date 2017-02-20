// https://developer.mozilla.org/en-US/docs/Web/API/PushManager
class PushSubscription {
  constructor(options) {
    this.endpoint = 'test.com/12345';
    this.options = options;
  }

  getKey() {
    return new ArrayBuffer(this.endpoint.length);
  }

  toJSON() {
    return {
      endpoint: this.endpoint,
      options: this.options
    };
  }

  unsubscribe() {
    return Promise.resolve(true);
  }
}

module.exports = PushSubscription;
