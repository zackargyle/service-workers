const NotificationData = (extras) => Object.assign({
  title: 'MOCK_TITLE',
  image: 'MOCK_IMAGE.png',
  body: 'MOCK_BODY',
}, extras);

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
  NotificationData,
  Notification,
  PushNotificationEvent,
  NotificationClickEvent,
  Subscription,
};
