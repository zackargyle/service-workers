const makeServiceWorkerEnv = require('../index');
const NodeURL = require('url').URL;
const DomURL = require('dom-urls');

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

  it('takes a DOM URL instance only', () => {
    const stringUrl = 'http://test.com/resource.html';
    const domUrl = new DomURL(stringUrl);
    const req = new Request(domUrl);

    expect(req.url).toEqual(stringUrl);
  });

  it('takes a Node URL instance only', () => {
    const stringUrl = 'http://test.com/resource.html';
    const domUrl = new NodeURL(stringUrl);
    const req = new Request(domUrl);

    expect(req.url).toEqual(stringUrl);
  });

  it('takes an absolute url path only (concatenated to location.href)', () => {
    const stringUrl = '/resource.html';
    const req = new Request(stringUrl);

    expect(req.url).toEqual('https://www.test.com' + stringUrl);
  });

  it('takes a relative url path only (concatenated to location.href)', () => {
    const stringUrl = 'resource.html';
    const req = new Request(stringUrl);

    expect(req.url).toEqual('https://www.test.com/' + stringUrl);
  });

  it('an empty url defaults to location.href (with trailing slash, that is how browsers do)', () => {
    const stringUrl = '';
    const req = new Request(stringUrl);

    expect(req.url).toEqual('https://www.test.com/');
  });

  it('takes a Request instance only', () => {
    const stringUrl = 'http://test.com/resource.html';
    const reqInstance = new Request(stringUrl);
    const req = new Request(reqInstance);

    expect(req.url).toEqual(stringUrl);
  });

  it('takes Request properties as options', async () => {
    const stringUrl = '/resource.html';
    const options = {
      body: 'override body',
      credentials: 'override-credentials',
      headers: {
        'x-override': 'override value'
      },
      method: 'OMY',
      mode: 'no-mode',
      referrer: 'http://referrer.com/'
    };
    const req = new Request(stringUrl, options);

    expect(req.url).toEqual('https://www.test.com' + stringUrl);
    expect(await req.text()).toEqual(options.body);
    expect(req.body.size).toBe(13);
    expect(req.credentials).toEqual(options.credentials);
    expect(req.method).toEqual(options.method);
    expect(req.mode).toEqual(options.mode);
    expect(req.referrer).toEqual(options.referrer);
    expect(req.headers.get('x-override')).toEqual('override value');
  });

  it('overrides Request properties with options', async () => {
    const stringUrl = 'http://test.com/resource.html';
    const reqInstance = new Request(stringUrl);
    const options = {
      body: 'override body',
      credentials: 'override-credentials',
      headers: {
        'x-override': 'override value'
      },
      method: 'OMY',
      mode: 'no-mode',
      referrer: 'http://referrer.com/'
    };
    const req = new Request(reqInstance, options);

    expect(req.url).toEqual(stringUrl);
    expect(await req.text()).toEqual(options.body);
    expect(req.credentials).toEqual(options.credentials);
    expect(req.method).toEqual(options.method);
    expect(req.mode).toEqual(options.mode);
    expect(req.referrer).toEqual(options.referrer);
    expect(req.headers.get('x-override')).toEqual('override value');
  });

  it('can be cloned with method, mode, headers and body', async () => {
    const stringUrl = 'http://test.com/resource.html';
    const options = {
      body: 'override body',
      headers: {
        'X-Custom': 'custom-value'
      }
    };
    const originalReq = new Request(stringUrl, options);
    const req = originalReq.clone();

    expect(req.url).toEqual(stringUrl);
    expect(await req.text()).toEqual(options.body);
    expect(req.body.size).toBe(13);
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
