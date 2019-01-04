const WindowClient = require('./WindowClient');

// https://developer.mozilla.org/en-US/docs/Web/API/Clients
class Clients {
  constructor() {
    this.clients = [];
  }

  get(id) {
    const client = this.clients.find(cli => id === cli.id);
    return Promise.resolve(client || null);
  }

  matchAll({ type = 'all' } = {}) {
    if (type === 'all') {
      return Promise.resolve(this.clients);
    }
    const matchedClients = this.clients.filter(client => client.type === type);
    return Promise.resolve(matchedClients);
  }

  openWindow(url) {
    const windowClient = new WindowClient(url);
    this.clients.push(windowClient);
    return Promise.resolve(windowClient);
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
