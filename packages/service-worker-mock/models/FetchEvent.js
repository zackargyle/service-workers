const ExtendableEvent = require('./ExtendableEvent');
const Request = require('./Request');

class FetchEvent extends ExtendableEvent {
   constructor(type, init) {
      super();
      this.type = type;
      this.isReload = init.isReload || false;
      this.clientId = init.clientId || null;
      if (init.request instanceof Request) {
        this.request = init.request;
      } else if (typeof init.request === 'string') {
        this.request = new Request(init.request);
      }
   }
   respondWith(response) {
      this.promise = response;
   }
}

module.exports = FetchEvent;
