const Response = require('../models/Response');
const Headers = require('../models/Headers');

describe('Response', () => {
  it('should create an error Response', () => {
    const response = Response.error();
    expect(response.type).toEqual('error');
    expect(response.body).toBeNull();
    expect(response.status).toEqual(0);
  });

  it('can be created without body', () => {
    const stringUrl = 'http://test.com/resource.html';
    const res = new Response(null, {
      url: stringUrl,
      status: 404,
      statusText: 'not found'
    });

    expect(res.url).toEqual(stringUrl);
    expect(res.status).toEqual(404);
    expect(res.statusText).toEqual('not found');
  });

  it('has default values ', () => {
    const res = new Response(null);

    expect(res.url).toEqual('http://example.com/asset');
    expect(res.status).toEqual(200);
    expect(res.statusText).toEqual('OK');
    expect(res.type).toEqual('basic');
    expect(res.headers).toBeInstanceOf(Headers);
  });

  it('can use object headers', () => {
    const res = new Response(null, {
      headers: {
        'X-Custom': 'custom-value'
      }
    });

    expect(res.headers.get('X-Custom')).toEqual('custom-value');
  });

  it('redirect creates a redirect response', () => {
    const stringUrl = 'http://test.com/resource.html';
    const res = Response.redirect(stringUrl, 301);

    expect(res.headers.get('location')).toEqual(stringUrl);
    expect(res.status).toEqual(301);
  });

  it('throws RangeError for a wrong status code', () => {
    expect(() => {
      Response.redirect('https://google.com/', 200);
    }).toThrow(RangeError);
  });

  it('should throw when trying to read body from opaque response');
});
