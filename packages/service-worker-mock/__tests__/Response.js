const Response = require('../models/Response');

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
  });

  it('can use object headers', () => {
    const res = new Response(null, {
      headers: {
        'X-Custom': 'custom-value'
      }
    });
    console.log('HEADERS', res.headers);
    expect(res.headers.get('X-Custom')).toEqual('custom-value');
  });

  it('should throw when trying to read body from opaque response');
});
