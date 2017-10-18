const Event = require('../models/Event');
const FetchEvent = require('../models/FetchEvent');
const NotificationEvent = require('../models/NotificationEvent');
const PushEvent = require('../models/PushEvent');

function createEvent(event, args) {
  switch (event) {
    case 'fetch':
      return new FetchEvent('fetch', { request: args });
    case 'notificationclick':
      return new NotificationEvent(args);
    case 'push':
      return new PushEvent(args);
    default:
      return new Event();
  }
}

function handleEvent(name, args, callback) {
  const event = createEvent(name, args);
  callback(event);
  return Promise.resolve(event.promise);
}

function eventHandler(name, args, listeners) {
  if (listeners.length === 1) {
    return handleEvent(name, args, listeners[0]);
  }
  return Promise.all(
    listeners.map(callback => handleEvent(name, args, callback))
  );
}

module.exports = eventHandler;
