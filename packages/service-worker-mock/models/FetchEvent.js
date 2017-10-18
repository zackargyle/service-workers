const Event = require('./Event');
const Request = require('./Request');

class FetchEvent extends Event {
  constructor(args) {
    super();
    if (args instanceof Request) {
      this.request = args;
    } else if (typeof args === 'string') {
      this.request = Request(args);
    }
  }
  respondWith(response) {
    this.promise = response;
  }
}

module.exports = FetchEvent;
