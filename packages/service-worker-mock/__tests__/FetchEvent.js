const makeServiceWorkerEnv = require('../index');
const FetchEvent = require('../models/FetchEvent');

describe('FetchEvent', () => {
  it('should construct with Request', () => {
    Object.assign(global, makeServiceWorkerEnv());

    const request = new Request('/test');
    const event = new FetchEvent('fetch', { request });

    expect(event.request.url).toEqual('https://www.test.com/test');
  });

  it('should construct with string', () => {
    Object.assign(global, makeServiceWorkerEnv());

    const request = '/test';
    const event = new FetchEvent('fetch', { request });

    expect(event.request.url).toEqual('https://www.test.com/test');
  });

  it('will throw if respondWith was already called', async () => {
    Object.assign(global, makeServiceWorkerEnv());

    const request = '/test';
    const event = new FetchEvent('fetch', { request });

    try {
      event.respondWith(Promise.resolve(new Response()));
      event.respondWith(Promise.resolve(new Response()));
      expect(false).toBe(true);
    } catch (err) {
      expect(err.message).toMatch('The event has already been responded to');
    }
  });
});
