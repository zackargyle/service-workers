// https://developer.mozilla.org/en-US/docs/Web/API/Notification
class Notification {
  constructor(title, options) {
    this.title = title;
    Object.assign(this, options);
  }

  snapshot() {
    const keys = Object.keys(this);
    const result = {};
    for (let i = 0; i < keys.length; i += 1) {
      if (typeof this[keys[i]] !== 'function') {
        result[keys[i]] = this[keys[i]];
      }
    }
    return result;
  }
}

Notification.requestPermission = function () {
  return Promise.resolve(Notification.permission);
};

Notification.permission = 'granted';

module.exports = Notification;
