// https://developer.mozilla.org/en-US/docs/Web/API/NavigationPreloadManager
class NavigationPreloadManager {
  constructor() {
    this.enabled = false;
  }

  enable() {
    this.enabled = true;
    return Promise.resolve();
  }

  disable() {
    this.enabled = false;
    return Promise.resolve();
  }

  setHeaderValue() {
    throw new Error('NavigationPreloadManager.setHeaderValue not implemented');
  }

  getState() {
    throw new Error('NavigationPreloadManager.getState not implemented');
  }
}

module.exports = NavigationPreloadManager;
