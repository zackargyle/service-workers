const makeServiceWorkerEnv = require('../index');

describe('MessageEvent', () => {
  beforeEach(() => {
    Object.assign(global, makeServiceWorkerEnv());
    jest.resetModules();
  });

  it('should properly initialize message with defaults', () => {
    const event = new MessageEvent('message');

    expect(event.data).toEqual(null);
    expect(event.origin).toEqual('');
    expect(event.lastEventId).toEqual('');
    expect(event.source).toEqual(null);
    expect(event.ports).toEqual([]);
  });

  it('should properly initialize message with data', () => {
    const init = {
      data: 'Hello world'
    };

    const event = new MessageEvent('message', init);
    expect(event.data).toEqual('Hello world');
  });
});
