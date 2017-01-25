global.__TEST_MODE__ = true;

const listeners = {};

global.self = {
  addEventListener: jest.fn(),
  registration: {
    getNotifications: jest.fn(),
    showNotification: jest.fn(),
    pushManager: {
      getSubscription: jest.fn(),
    },
  },
}

global.clients = {
  matchAll: jest.fn(),
  openWindow: jest.fn(),
};

global.$Cache = {

};

global.$Notifications = {
  fetch: { url: '__/__fetch/url' },
  log: { url: '__/__/log/url' }
};
