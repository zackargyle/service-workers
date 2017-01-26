const Notification = (extras) => Object.assign({
  tag: 'default-tag',
  data: {},
  close: jest.fn(),
}, extras);

const PushNotificationEvent = (notification) => Object.assign({
  waitUntil: jest.fn(),
}, Notification(notification));

const NotificationClickEvent = (notification) => Object.assign({
  notification: Notification(notification),
  waitUntil: jest.fn(),
});

const Subscription = (extras) => Object.assign({
  subscriptionId: '12345',
  endpoint: '/12345',
}, extras);

module.exports = {
  Notification,
  PushNotificationEvent,
  NotificationClickEvent,
  Subscription,
};
