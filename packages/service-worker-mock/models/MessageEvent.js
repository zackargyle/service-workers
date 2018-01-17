const ExtendableEvent = require('./ExtendableEvent');

class MessageEvent extends ExtendableEvent {
  constructor(type, args) {
    super();
    Object.assign(this, args);
  }
}

module.exports = MessageEvent;
