const MessagePort = require('./MessagePort');

class MessageChannel {
  constructor() {
    this.port1 = new MessagePort();
    this.port2 = new MessagePort();
    this.port2._targetPort = this.port1;
  }
}

module.exports = MessageChannel;
