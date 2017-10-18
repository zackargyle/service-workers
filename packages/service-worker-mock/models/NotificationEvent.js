const ExtendableEvent = require('./ExtendableEvent');

// https://developer.mozilla.org/en-US/docs/Web/API/NotificationEvent
class NotificationEvent extends ExtendableEvent {
  constructor(args) {
    super();
    this.notification = args;
  }
}

module.exports = NotificationEvent;
