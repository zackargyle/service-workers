const Event = require('./Event');

class PushEvent extends Event {
  constructor(args) {
    super();
    Object.assign(this, args);
  }
}

module.exports = PushEvent;
