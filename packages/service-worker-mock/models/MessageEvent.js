const ExtendableEvent = require('./ExtendableEvent');

class MessageEvent extends ExtendableEvent {
  constructor(type, args) {
    super();

    this.data = args;
  }
}

module.exports = MessageEvent;
