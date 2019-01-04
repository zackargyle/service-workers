const makeServiceWorkerEnv = require('../index');
const Clients = require('../models/Clients');
const Client = require('../models/Client');
const WindowClient = require('../models/WindowClient');

const CLIENT_FIXTURES = [
  new Client('/'),
  new Client('/', 'sharedworker'),
  new WindowClient('https://www.abc.com')
];

describe('Clients', () => {
  beforeEach(() => {
    Object.assign(global, makeServiceWorkerEnv());
    jest.resetModules();
  });

  it('should get client by id', async () => {
    const clients = new Clients();
    clients.clients = CLIENT_FIXTURES;

    const expectedClient = await clients.get(CLIENT_FIXTURES[0].id);
    expect(expectedClient.id).toBe(CLIENT_FIXTURES[0].id);
  });

  it('should able to open a new window', async () => {
    const clients = new Clients();
    await clients.openWindow('https://www.abc.com');

    expect(clients.snapshot()).toHaveLength(1);
    expect(clients.snapshot()[0].url).toBe('https://www.abc.com');
  });
});
