const Client = require('./Client');

// https://developer.mozilla.org/en-US/docs/Web/API/Clients
class Clients {
  constructor() {
    this.clients = [];
  }

  get(id) {
    const client = this.clients.find(cli => id === cli.id);
    return Promise.resolve(client || null);
  }

  matchAll() {
    return Promise.resolve(this.clients);
  }

  openWindow(url, postMessageCallback) {
    const client = new Client(url, { postMessageCallback });
    this.clients.push(client);
    return Promise.resolve(client);
  }

  claim() {
    return Promise.resolve(this.clients);
  }

  snapshot() {
    return this.clients.map(client => client.snapshot());
  }

  reset() {
    this.clients = [];
  }
}

module.exports = Clients;
