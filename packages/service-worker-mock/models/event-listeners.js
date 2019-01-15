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
const ExtendableEvent = require('./ExtendableEvent');

function createListeners() {
  let _listenerMap = new Map();
  const createExtendedSet = (values) => {
    const set = new Set(values);

    Object.defineProperty(set, 'at', {
      enumerable: false,
      value: function (pos) {
        return Array.from(this.values())[pos];
      }
    });

    return set;
  };

  const addEventListener = (type, listener /* TODO: support `opts` */) => {
    if (_listenerMap.has(type)) {
      _listenerMap.get(type).add(listener);
    } else {
      _listenerMap.set(type, createExtendedSet([listener]));
    }
  };

  const dispatchEvent = (event) => {
    const listeners = _listenerMap.get(event.type);

    if (listeners) {
      for (const listener of listeners) {
        listener(event);
      }
    }
  };

  const resetEventListeners = () => {
    _listenerMap.clear();
    ExtendableEvent._allExtendableEvents.clear();
  };

  return {
    addEventListener,
    dispatchEvent,
    resetEventListeners,
    _listenerMap
  };
}

module.exports = {
  createListeners
};
