const ExtendableEvent = require('../models/ExtendableEvent');
const FetchEvent = require('../models/FetchEvent');
const NotificationEvent = require('../models/NotificationEvent');
const PushEvent = require('../models/PushEvent');
const MessageEvent = require('../models/MessageEvent');

function createEvent(event, args) {
   switch (event) {
      case 'fetch':
         return new FetchEvent('fetch', getFetchArguments(args));
      case 'notificationclick':
         return new NotificationEvent(args);
      case 'push':
         return new PushEvent(args);
      case 'message':
         return new MessageEvent('message', args);
      default:
         return new ExtendableEvent();
   }
}

function getFetchArguments(args) {
   let request = args,
      clientId = null;

   if (typeof args === "object" && args.request) {
      clientId = args.clientId || null;
      request = args.request;
   }

   return {
      request,
      clientId
   };
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
