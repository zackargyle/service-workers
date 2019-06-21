const PushManager = require('./PushManager');
const NavigationPreloadManager = require('./NavigationPreloadManager');
const Notification = require('./Notification');
const NotificationEvent = require('./NotificationEvent');
const SyncManager = require('./SyncManager');
const EventTarget = require('./EventTarget');

// https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration
class ServiceWorkerRegistration extends EventTarget {
  constructor() {
    super();

    this.active = null;
    this.installing = null;
    this.onupdatefound = null;
    this.pushManager = new PushManager();
    this.navigationPreload = new NavigationPreloadManager();
    this.sync = new SyncManager();
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
    return Promise.resolve(new NotificationEvent('notification', { notification }));
  }

  update() {
    return Promise.resolve();
  }

  unregister() {
    return Promise.resolve();
  }

  snapshot() {
    return this.notifications.map(n => n.snapshot());
  }
}

module.exports = ServiceWorkerRegistration;
