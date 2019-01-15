/*
 Copyright 2017 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/


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
