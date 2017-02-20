const Client = require('./client');

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

  openWindow(url) {
    const client = new Client(url);
    this.clients.push(client);
    return Promise.resolve(client);
  }

  claim() {
    return Promise.resolve(this.clients);
  }

  snapshot() {
    return this.clients.map(client => client.snapshot());
  }

}

module.exports = Clients;
