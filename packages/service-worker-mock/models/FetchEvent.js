const ExtendableEvent = require('./ExtendableEvent');
const Request = require('./Request');

class FetchEvent extends ExtendableEvent {
   constructor(type, init) {
      super();
      this.type = type;
      this.isReload = init.isReload || false;
      this.clientId = null;

      let request = init.request;

      if (typeof request === "object" && request.request) {
         this.clientId = request.clientId || null;
         request = request.request;
      }

      if (request instanceof Request) {
         this.request = request;
      } else if (typeof request === 'string') {
         this.request = new Request(request);
      }
   }
   respondWith(response) {
      this.promise = response;
   }
}

module.exports = FetchEvent;
