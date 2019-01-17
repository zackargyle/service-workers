// Derived from https://github.com/GoogleChrome/workbox

const ExtendableEvent = require('./ExtendableEvent');
const Request = require('./Request');

// FetchEvent
// https://www.w3.org/TR/service-workers-1/#fetch-event-section
class FetchEvent extends ExtendableEvent {
  constructor(type, init = {}) {
    super(type, init);

    if (!init.request) {
      throw new TypeError('Failed to construct \'FetchEvent\': ' +
          'Missing required member(s): request.');
    }

    if (init.request instanceof Request) {
      this.request = init.request;
    } else if (typeof init.request === 'string') {
      this.request = new Request(init.request);
    }
    this.clientId = init.clientId || null;
    this.isReload = init.isReload || false;
    this._respondWithEnteredFlag = false;
  }

  respondWith(promise) {
    if (this._respondWithEnteredFlag) {
      throw new DOMException('Failed to execute \'respondWith\' on ' +
        '\'FetchEvent\': The event has already been responded to.');
    }
    this._respondWithEnteredFlag = true;

    this._extendLifetimePromises.add(promise);
  }
}

module.exports = FetchEvent;
