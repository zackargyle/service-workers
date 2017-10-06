const Event = require('./Event');

class FetchEvent extends Event {
  constructor(args) {
    super();
    if (typeof args === 'string') {
      this.request = { url: args };
    } else if (args && typeof args === 'object') {
      this.request = args;
    }
  }
  respondWith(response) {
    this.promise = response;
  }
}

module.exports = FetchEvent;
