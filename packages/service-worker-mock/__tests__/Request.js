const makeServiceWorkerEnv = require('../index');

describe('Request', () => {
  beforeEach(() => {
    Object.assign(global, makeServiceWorkerEnv());
    jest.resetModules();
  });

  it('takes a string URL only', () => {
    const stringUrl = 'http://test.com/resource.html';
    const req = new Request(stringUrl);

    expect(req.url).toEqual(stringUrl);
  });

  it('takes a string DOM URL instance only', () => {
    const stringUrl = 'http://test.com/resource.html';
    const domUrl = new URL(stringUrl);
    const req = new Request(domUrl);

    expect(req.url).toEqual(stringUrl);
  });

  it('takes a Request instance only', () => {
    const stringUrl = 'http://test.com/resource.html';
    const reqInstance = new Request(stringUrl);
    const req = new Request(reqInstance);

    expect(req.url).toEqual(stringUrl);
  });

  it('can be cloned with method, mode and headers', () => {
    const stringUrl = 'http://test.com/resource.html';
    const originalReq = new Request(stringUrl, {
      headers: {
        'X-Custom': 'custom-value'
      }
    });
    const req = originalReq.clone();

    expect(req.url).toEqual(stringUrl);
    expect(req.mode).toEqual(originalReq.mode);
    expect(req.method).toEqual(originalReq.method);
    expect(req.headers.get('X-Custom')).toEqual('custom-value');
  });

  it('takes a string body', async () => {
    const stringUrl = 'http://test.com/resource.html';
    const reqInstance = new Request(stringUrl, {
      body: 'content'
    });
    const req = new Request(reqInstance);

    expect(await req.text()).toEqual('content');
  });
});
