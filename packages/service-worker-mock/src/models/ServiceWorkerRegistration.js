const PushManager = require('./PushManager');
const Notification = require('./Notification');
const NotificationEvent = require('./NotificationEvent');

// https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration
class ServiceWorkerRegistration {
  constructor() {
    this.active = null;
    this.installing = null;
    this.onupdatefound = null;
    this.pushManager = new PushManager();
    this.scope = '/';
    this.waiting = null;

    this.notifications = [];
  }

  getNotifications() {
    return Promise.resolve(this.notifications);
  }

  showNotification(title, options) {
    const notification = new Notification(title, options);
    this.notifications.push(notification);
    notification.close = () => {
      const index = this.notifications.indexOf(notification);
      this.notifications.splice(index, 1);
    };
    return Promise.resolve(new NotificationEvent(notification));
  }

  update() {
    return Promise.resolve();
  }

  unregister() {
    return Promise.resolve();
  }

  snapshot() {
    return {
      pushManager: this.pushManager.snapshot(),
      notifications: this.notifications.map(n => n.snapshot())
    };
  }
}

module.exports = ServiceWorkerRegistration;
