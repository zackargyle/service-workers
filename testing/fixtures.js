const Request = (extras) => Object.assign({
  method: 'GET',
  url: 'test.js'
}, extras);

const Response = (extras) => Object.assign({
  ok: true,
  value: 42,
  clone: () => Response(extras)
}, extras);

/*    External Fixtures   */

const Cache = (overrides) => Object.assign({
  match: jest.fn(() => Promise.resolve()),
  put: jest.fn(() => Promise.resolve()),
}, overrides);

const Event = (overrides) => Object.assign({
  waitUntil: jest.fn(),
}, overrides);

const Notification = (overrides) => Object.assign({
  tag: 'default-tag',
  data: {},
  close: jest.fn(),
}, overrides);

const NotificationClickEvent = (notification) => Object.assign(Event(), {
  notification: Notification(notification),
});

const NotificationData = (overrides) => Object.assign({
  title: 'MOCK_TITLE',
  image: 'MOCK_IMAGE.png',
  body: 'MOCK_BODY',
}, overrides);

const PushNotificationEvent = (notification) => Object.assign(Event(), Notification(notification));

const Subscription = (overrides) => Object.assign({
  subscriptionId: '12345',
  endpoint: '/12345',
}, overrides);

/*    Internal Fixtures   */

const $LocationMap = (override) => override || ({
  main: '/sw-main.js',
  test: '/sw-test.js',
});

const $Cache = (override) => override || ({

});

const $Notifications = (override) => override || ({
  default: {
    title: 'PWA Plugin',
    body: 'You’ve got everything working!',
    icon: 'https://developers.google.com/web/images/web-fundamentals-icon192x192.png',
    tag: 'default-push-notification',
    data: {
      url: 'https://github.com/pinterest/pwa',
    },
  }
});

const $Log = (override) => override || ({
  installed: '__/sw/installed',
  notificationClicked: '__/sw/notif-clicked',
  notificationReceived: '__/sw/notif-received'
});

module.exports = {
  Request,
  Response,
  // External
  Cache,
  Event,
  Notification,
  NotificationClickEvent,
  NotificationData,
  PushNotificationEvent,
  Subscription,
  // Internal
  $LocationMap,
  $Cache,
  $Notifications,
  $Log,
};
