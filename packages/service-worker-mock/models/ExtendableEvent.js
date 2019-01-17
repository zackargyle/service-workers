// Derived from https://github.com/GoogleChrome/workbox

const Event = require('./Event');

// ExtendableEvent
// https://www.w3.org/TR/service-workers-1/#extendable-event
class ExtendableEvent extends Event {
  constructor(...args) {
    super(...args);

    this.response = null;

    // https://www.w3.org/TR/service-workers-1/#dfn-extend-lifetime-promises
    this._extendLifetimePromises = new Set();

    // Used to keep track of all ExtendableEvent instances.
    _allExtendableEvents.add(this);
  }

  waitUntil(promise) {
    this._extendLifetimePromises.add(promise);
  }
}


// WORKBOX TODO: if workbox wants to use service-worker-mocks only,
// it needs to migrate at https://github.com/GoogleChrome/workbox/blob/912080a1bf3255c61151ca3d0ebd0895aaf377e2/test/workbox-google-analytics/node/test-index.mjs#L19
// and import `eventsDoneWaiting` from the `ExtendableEvent`
let _allExtendableEvents = new Set();
ExtendableEvent._allExtendableEvents = _allExtendableEvents;
ExtendableEvent.eventsDoneWaiting = () => {
  const allExtendLifetimePromises = [];

  // Create a single list of _extendLifetimePromises values in all events.
  // Also add `catch` handlers to each promise so all of them are run, rather
  // that the normal behavior `Promise.all` erroring at the first error.
  for (const event of _allExtendableEvents) {
    const extendLifetimePromisesOrErrors = [...event._extendLifetimePromises]
        .map((promise) => promise.catch((err) => err));

    allExtendLifetimePromises.push(...extendLifetimePromisesOrErrors);
  }

  return Promise.all(allExtendLifetimePromises);
};

module.exports = ExtendableEvent;
