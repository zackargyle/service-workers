const notifications = require('../notifications');

describe('[service-worker/templates] notifications', function() {

  it('should register events', function() {
    global.$Notifications = {
      fetch: { url: '__/__fetch/url' },
      log: { url: '__/__/log/url' }
    };
    notifications.initNotifications();
    const calls = global.self.addEventListener.mock.calls;
    expect(calls.length).toEqual(2);
    expect(calls[0]).toEqual(['push', notifications.handleNotificationPush]);
    expect(calls[1]).toEqual(['notificationclick', notifications.handleNotificationClick]);
  });

  it('should handle push notifications', function() {

  });

  it('should handle notification clicks', function() {

  });

  describe('[fn] getMappedTag', function() {
    it('should ...', function() {

    });
  });

  describe('[fn] formatUrl', function() {
    it('should ...', function() {

    });
  });

});
