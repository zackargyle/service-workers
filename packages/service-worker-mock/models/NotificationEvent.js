const ExtendableEvent = require('./ExtendableEvent');

// https://developer.mozilla.org/en-US/docs/Web/API/NotificationEvent
class NotificationEvent extends ExtendableEvent {
  constructor(type, init) {
    super(type, init);
    this.notification = init ? init.notification : null;
    this.action = init ? init.action : null;
  }
}

module.exports = NotificationEvent;
