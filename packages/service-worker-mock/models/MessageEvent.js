const ExtendableEvent = require('./ExtendableEvent');

// https://developer.mozilla.org/en-US/docs/Web/API/MessageEvent/MessageEvent
const defaults = () => ({
  data: null,
  origin: '',
  lastEventId: '',
  source: null,
  ports: []
});
class MessageEvent extends ExtendableEvent {
  constructor(type, init) {
    super(type);
    Object.assign(this, defaults(), init);
  }
}

module.exports = MessageEvent;
