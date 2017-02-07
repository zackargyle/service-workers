// Make promises synchronous
global.Promise = require('./sync-promise');
const Subscription = require('./fixtures').Subscription;

const noop = () => {};

global.__TEST_MODE__ = true;

global.navigator = {
  serviceWorker: {
    get ready() {
      return Promise.resolve(navigator.serviceWorker);
    },
    pushManager: {
      subscribe: jest.fn(),
    },
    register: jest.fn(),
  },
};

global.fetch = jest.fn(() => Promise.resolve());

global.self = {
  addEventListener: jest.fn(),
  registration: {
    getNotifications: jest.fn(() => Promise.resolve([])),
    showNotification: jest.fn(() => Promise.resolve()),
    pushManager: {
      getSubscription: jest.fn(() => Promise.resolve(Subscription())),
    },
  },
}

global.clients = {
  matchAll: jest.fn(),
  openWindow: jest.fn(),
};

global.logger = {
  log: noop,
  warn: noop,
  error: noop,
}

global.$LocationMap = {
  main: '/sw-main.js',
  test: '/sw-test.js',
};

global.$Cache = {

};

global.$Notifications = {
  default: {
    title: 'PWA Plugin',
    body: 'You’ve got everything working!',
    icon: 'https://developers.google.com/web/images/web-fundamentals-icon192x192.png',
    tag: 'default-push-notification',
    data: {
      url: 'https://github.com/pinterest/pwa',
    },
  },
  fetchData: {
    url: '__/__fetch/url'
  },
  logClick: {
    url: '__/__/log/url'
  },
};

global.$Log = {
  installed: '__/sw/installed',
  notificationClicked: '__/sw/notif-clicked',
  notificationReceived: '__/sw/notif-received'
};
