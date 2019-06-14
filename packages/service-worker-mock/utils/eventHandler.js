const ExtendableEvent = require('../models/ExtendableEvent');
const FetchEvent = require('../models/FetchEvent');
const NotificationEvent = require('../models/NotificationEvent');
const PushEvent = require('../models/PushEvent');
const MessageEvent = require('../models/MessageEvent');

function createEvent(event, args) {
  switch (event) {
    case 'fetch':
      return new FetchEvent('fetch', { request: args });
    case 'notificationclick':
    case 'notificationclose':
      return new NotificationEvent('notification', { notification: args });
    case 'push':
      return new PushEvent(args);
    case 'message':
      return new MessageEvent('message', args);
    default:
      return new ExtendableEvent();
  }
}

function handleEvent(name, args, callback) {
  const event = createEvent(name, args);
  callback(event);
  return Promise.all(Array.from(event._extendLifetimePromises.values()));
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
