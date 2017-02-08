const fixtures = require('../../../../testing/fixtures');
// Injected vars
global.$Cache = fixtures.$Cache();
global.$Log = fixtures.$Log();
global.$Notifications = fixtures.$Notifications();
// Import main module
const sw = require('../notifications');

describe('[generate-service-worker/templates] notifications', function () {
  afterEach(() => {
    global.self.registration.getNotifications.mockClear();
    global.self.registration.showNotification.mockClear();
    global.self.registration.pushManager.getSubscription.mockClear();
    global.clients.matchAll.mockClear();
    global.clients.openWindow.mockClear();
    global.fetch.mockClear();
  });

  it('should register events on load', function () {
    const calls = global.self.addEventListener.mock.calls;
    expect(calls.length).toEqual(2);
    expect(calls[0]).toEqual(['push', sw.handleNotificationPush]);
    expect(calls[1]).toEqual(['notificationclick', sw.handleNotificationClick]);
  });

  describe('> handleNotificationPush', () => {
    it('[with valid $Log.notificationReceived] should log notification received', function () {
      const event = fixtures.PushNotificationEvent();
      sw.handleNotificationPush(event);
      expect(event.waitUntil.mock.calls.length).toEqual(2);
      expect(global.fetch.mock.calls.length).toEqual(1);
      expect(global.fetch.mock.calls[0][0]).toEqual('__/sw/notif-received?endpoint=/12345&tag=default-tag');
    });

    it('[with valid event.data] should immediately show notification', function () {
      const event = fixtures.PushNotificationEvent({ data: { title: 'hello world' } });
      sw.handleNotificationPush(event);
      const calls = global.self.registration.showNotification.mock.calls;
      expect(calls.length).toEqual(1);
      expect(calls[0]).toEqual([event.data.title, event.data]);
    });

    it('[with invalid event.data] should show the fallback notification data', function () {
      const event = fixtures.PushNotificationEvent();
      sw.handleNotificationPush(event);
      const calls = global.self.registration.showNotification.mock.calls;
      expect(calls.length).toEqual(1);
      expect(calls[0]).toEqual([$Notifications.default.title, $Notifications.default]);
    });
  });

  describe('> handleNotificationClick', () => {
    it('should close the notification', function () {
      const event = fixtures.NotificationClickEvent();
      sw.handleNotificationClick(event);
      expect(event.notification.close.mock.calls.length).toEqual(1);
    });

    it('[with valid data.url] should open a new window', function () {
      const event = fixtures.NotificationClickEvent({ data: { url: '/fake/url' } });
      sw.handleNotificationClick(event);
      expect(clients.openWindow.mock.calls.length).toEqual(1);
      expect(clients.openWindow.mock.calls[0][0]).toEqual(event.notification.data.url);
      expect(event.waitUntil.mock.calls.length).toEqual(2);
    });

    it('[with $Log.notificationClicked] shoult call fetch with logClick url', function () {
      const event = fixtures.NotificationClickEvent();
      sw.handleNotificationClick(event);
      expect(global.fetch.mock.calls.length).toEqual(1);
      expect(global.fetch.mock.calls[0][0]).toEqual('__/sw/notif-clicked?endpoint=/12345&tag=default-tag');
    });

    it('[without logClick] should NOT call fetch without logClick url', function () {
      global.$Log.notificationClicked = null;
      const event = fixtures.NotificationClickEvent();
      sw.handleNotificationClick(event);
      expect(global.fetch.mock.calls.length).toEqual(0);
    });
  });
});
