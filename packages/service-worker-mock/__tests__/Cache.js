const makeServiceWorkerEnv = require('../index');

describe('Cache', () => {
  beforeEach(() => {
    Object.assign(global, makeServiceWorkerEnv());
    jest.resetModules();
  });

  it('gets all cache keys (relative url)', async () => {
    const cache = new Cache();

    cache.put('/test1.html', new Response());
    cache.put('/test2.html', new Response());

    const keys = await cache.keys();

    // The Cache mock stores relative urls as well (non-standard)
    expect(keys.length).toBe(4);
  });

  it('gets all cache keys (absolute url)', async () => {
    const cache = new Cache();

    cache.put('http://test.com/test1.html', new Response());
    cache.put('http://test.com/test2.html', new Response());

    const keys = await cache.keys();

    expect(keys.length).toBe(2);
  });

  it('gets all matching cache keys for string (relative url)', async () => {
    const cache = new Cache();

    cache.put('/test1.html', new Response());
    cache.put('/test2.html', new Response());

    const keys = await cache.keys('/test1.html');

    // The Cache mock stores relative urls as well (non-standard)
    expect(keys.length).toBe(2);
  });

  it('gets all matching cache keys for string (absolute url)', async () => {
    const cache = new Cache();

    cache.put('http://test.com/test1.html', new Response());
    cache.put('http://test.com/test2.html', new Response());

    const keys = await cache.keys('http://test.com/test1.html');

    // The Cache mock stores relative urls as well (non-standard)
    expect(keys.length).toBe(1);
  });

  it('gets all matching cache keys for request', async () => {
    const cache = new Cache();

    cache.put('http://test.com/test1.html', new Response());
    cache.put('http://test.com/test2.html', new Response());

    const keys = await cache.keys(new Request('http://test.com/test1.html'));

    expect(keys.length).toBe(1);
  });
});
