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

  it('should get array of matched clients', async () => {
    const clients = new Clients();
    clients.clients = CLIENT_FIXTURES;

    // Without options
    let matchedClients = await clients.matchAll();
    expect(matchedClients).toHaveLength(3);

    // Get specific client by type
    matchedClients = await clients.matchAll({ type: 'sharedworker' });
    expect(matchedClients).toHaveLength(1);
  });

  it('should be able to open a new window', async () => {
    const clients = new Clients();
    await clients.openWindow('https://www.abc.com');

    expect(clients.snapshot()).toHaveLength(1);
    expect(clients.snapshot()[0].url).toBe('https://www.abc.com');
  });

  it('should able to receive messages', async () => {
    const clients = new Clients();
    const client = await clients.openWindow('https://www.abc.com');
    const messageHandler = jest.fn();

    client.addEventListener('message', messageHandler);
    client.postMessage({ value: 1 });

    expect(messageHandler).toBeCalledWith(expect.objectContaining({
      data: {
        value: 1
      }
    }));
  });

  it('can use a MessageChannel to receive answers', async () => {
    const clients = new Clients();
    const client = await clients.openWindow('https://www.abc.com');
    const channel = new MessageChannel();
    const messageHandler = jest.fn();

    channel.port1.onmessage = messageHandler;
    client.addEventListener('message', (event) => {
      event.ports[0].postMessage({
        answer: 1
      });
    });
    client.postMessage({ value: 1 }, [channel.port2]);

    expect(messageHandler).toBeCalledWith(expect.objectContaining({
      data: {
        answer: 1
      }
    }));
  });
});
