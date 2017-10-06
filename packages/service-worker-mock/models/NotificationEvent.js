const Event = require('./Event');

// https://developer.mozilla.org/en-US/docs/Web/API/NotificationEvent
class NotificationEvent extends Event {
  constructor(args) {
    super();
    this.notification = args;
  }
}

module.exports = NotificationEvent;
