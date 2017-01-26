const sw = require('../notifications');
const fixtures = require('../../../../testing/fixtures');
const PushNotificationEvent = fixtures.PushNotificationEvent;
const NotificationClickEvent = fixtures.NotificationClickEvent;
const Subscription = fixtures.Subscription;

describe('[generate-service-worker/templates] notifications', function() {

  afterEach(() => {
    global.self.registration.getNotifications.mockClear();
    global.self.registration.showNotification.mockClear();
    global.self.registration.pushManager.getSubscription.mockClear();
    global.clients.matchAll.mockClear();
    global.clients.openWindow.mockClear();
    global.fetch.mockClear();
  });

  it('should register events on load', function() {
    const calls = global.self.addEventListener.mock.calls;
    expect(calls.length).toEqual(2);
    expect(calls[0]).toEqual(['push', sw.handleNotificationPush]);
    expect(calls[1]).toEqual(['notificationclick', sw.handleNotificationClick]);
  });

  describe('> handleNotificationPush', () => {

    it('[with valid event.data] should not call getSubscription', function() {
      const event = PushNotificationEvent({ data: { title: 'hello world' }});
      sw.handleNotificationPush(event);
      expect(event.waitUntil.mock.calls.length).toEqual(1);
      expect(global.self.registration.pushManager.getSubscription.mock.calls.length).toEqual(0);
    });

    it('[with valid event.data] should immediately show notification', function() {
      const event = PushNotificationEvent({ data: { title: 'hello world' }});
      sw.handleNotificationPush(event);
      expect(global.self.registration.showNotification.mock.calls.length).toEqual(1);
      expect(global.self.registration.showNotification.mock.calls[0]).toEqual([event.data.title, event.data]);
    });

    it('[without valid event.data] should call getSubscription', function() {
      global.self.registration.pushManager.getSubscription
        .mockImplementationOnce(() => Promise.resolve(Subscription()));
      const event = PushNotificationEvent();
      sw.handleNotificationPush(event);
      expect(event.waitUntil.mock.calls.length).toEqual(1);
      expect(global.self.registration.pushManager.getSubscription.mock.calls.length).toEqual(1);
    });

    it('[without valid event.data] should fetch remote notification data', function() {
      global.self.registration.pushManager.getSubscription
        .mockImplementationOnce(() => Promise.resolve(Subscription()));
      const event = PushNotificationEvent();
      sw.handleNotificationPush(event);
      expect(global.fetch.mock.calls.length).toEqual(1);
      expect(global.fetch.mock.calls[0][0]).toEqual('__/__fetch/url?subscription_id=12345');
    });

  });

  describe('> handleNotificationClick', () => {

    it('should close the notification', function() {
      const event = NotificationClickEvent();
      sw.handleNotificationClick(event);
      expect(event.notification.close.mock.calls.length).toEqual(1);
    });

    it('[with valid data.url] should open a new window', function() {
      const event = NotificationClickEvent({ data: { url: '/fake/url' }});
      sw.handleNotificationClick(event);
      expect(clients.openWindow.mock.calls.length).toEqual(1);
      expect(clients.openWindow.mock.calls[0][0]).toEqual(event.notification.data.url);
      expect(event.waitUntil.mock.calls.length).toEqual(1);
    });

    it('[with logClick] shoult call fetch with logClick url', function() {
      global.$Notifications.logClick = {
        url: '__/sw/click',
      };
      const event = NotificationClickEvent();
      sw.handleNotificationClick(event);
      expect(global.fetch.mock.calls.length).toEqual(1);
      expect(global.fetch.mock.calls[0][0]).toEqual("__/sw/click?subscription_id=12345&tag=default-tag");
    });

    it('[without logClick] should NOT call fetch without logClick url', function() {
      global.$Notifications.logClick = null;
      const event = NotificationClickEvent();
      sw.handleNotificationClick(event);
      expect(global.fetch.mock.calls.length).toEqual(0);
    });

  });

});
