class Event {
  constructor() {
    this.promise = null;
    this.response = null;
  }

  waitUntil(promise) {
    this.promise = promise;
  }
}

module.exports = Event;
