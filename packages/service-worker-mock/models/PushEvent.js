const ExtendableEvent = require('./ExtendableEvent');

class PushEvent extends ExtendableEvent {
  constructor(args) {
    super();
    Object.assign(this, args);
  }
}

module.exports = PushEvent;
