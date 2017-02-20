const makeServiceWorkerEnv = require('../../../service-worker-mock/src/index');
const fixtures = require('../../../../testing/fixtures');
// Injected vars
global.$Cache = fixtures.$Cache();
global.$Log = fixtures.$Log();
global.$Notifications = fixtures.$Notifications();

describe('[generate-service-worker/templates] notifications', function () {
  beforeEach(() => {
    Object.assign(global, makeServiceWorkerEnv());
    jest.resetModules();
    global.fetch.mockClear();
    require('../notifications');
  });

  it('should register events on load', async () => {
    expect(self.listeners.push[0].name).toEqual('handleNotificationPush');
    expect(self.listeners.notificationclick[0].name).toEqual('handleNotificationClick');
  });

  describe('> handleNotificationPush', () => {
    it('[with valid $Log.notificationReceived] should log notification received', async () => {
      await self.trigger('push', { tag: 'default-tag' });
      expect(global.fetch.mock.calls[0][0]).toEqual('__/sw/notif-received?endpoint=test.com/12345&tag=default-tag');
    });

    it('[with valid event.data] should immediately show notification', async () => {
      const event = { data: { title: 'test', tag: 'default-tag' } };
      expect(self.registration.snapshot().notifications.length).toEqual(0);
      await self.trigger('push', event);
      expect(self.registration.snapshot().notifications[0].title).toEqual(event.data.title);
    });

    it('[with invalid event.data] should show the fallback notification data', async () => {
      expect(self.registration.snapshot().notifications.length).toEqual(0);
      await self.trigger('push');
      expect(self.registration.snapshot().notifications[0]).toEqual($Notifications.default);
    });
  });

  describe('> handleNotificationClick', () => {
    it('should close the notification', async () => {
      const event = await self.registration.showNotification('Title', { tag: 'default-tag' });
      expect(self.registration.snapshot().notifications[0].title).toEqual(event.notification.title);
      await self.trigger('notificationclick', event.notification);
      expect(self.registration.snapshot().notifications.length).toEqual(0);
    });

    it('[with valid data.url] should open a new window', async () => {
      const notification = { tag: 'default-tag', data: { url: '/fake/url' } };
      expect(self.clients.snapshot().length).toEqual(0);

      const event = await self.registration.showNotification('Title', notification);
      await self.trigger('notificationclick', event.notification);
      expect(self.clients.snapshot().length).toEqual(1);
    });

    it('[with $Log.notificationClicked] should log a click', async () => {
      const event = await self.registration.showNotification('Title', { tag: 'default-tag' });
      await self.trigger('notificationclick', event.notification);
      expect(global.fetch.mock.calls[0][0]).toEqual('__/sw/notif-clicked?endpoint=test.com/12345&tag=default-tag');
    });

    it('[without logClick] should NOT call fetch without logClick url', async () => {
      global.$Log = fixtures.$Log({ notificationClicked: null });
      const event = await self.registration.showNotification('Title', { tag: 'default-tag' });
      await self.trigger('notificationclick', event.notification);
      expect(global.fetch.mock.calls.length).toEqual(0);
    });
  });
});
