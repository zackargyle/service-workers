const PushSubscription = require('./PushSubscription');

// https://developer.mozilla.org/en-US/docs/Web/API/NavigationPreloadManager
class PushManager {
  constructor() {
    this.subscription = new PushSubscription();
  }

  enable() {
    // enable
    return Promise.resolve();
  }

  disable() {
    // disable
    return Promise.resolve();
  }

  setHeaderValue(value) {
    // sets the Service-Worker-Navigation-Preload header with value
    return Promise.resolve();
  }

  getState() {
    return Promise.resolve();
  }
}

module.exports = PushManager;
