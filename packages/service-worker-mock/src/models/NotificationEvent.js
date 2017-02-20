// https://developer.mozilla.org/en-US/docs/Web/API/NotificationEvent
class NotificationEvent {
  constructor(notification) {
    this.notification = notification;
  }

  get action() {
    throw new Error('PROPERTY NOT IMPLEMENTED');
  }

  waitUntil() {}
}

module.exports = NotificationEvent;
