const Headers = require('../models/Headers');

describe('Headers', () => {
  it('should construct with no defaults', () => {
    const headers = new Headers();
    expect(headers.get('accept')).toEqual(null);
  });

  it('should construct with Header instance', () => {
    const _headers = new Headers();
    _headers.set('accept', '*/*');
    const headers = new Headers(_headers);
    expect(headers.get('accept')).toEqual('*/*');
  });

  it('should construct with object', () => {
    const headers = new Headers({ accept: '*/*' });
    expect(headers.get('accept')).toEqual('*/*');
  });

  it('should ignore character case', () => {
    const headers = new Headers();
    headers.set('UPPER', 'UPPER');
    expect(headers.get('upper')).toEqual('UPPER');

    headers.append('UPPER', 'CASE');
    expect(headers.get('upper')).toEqual('UPPER,CASE');

    headers.delete('UPPER');
    expect(headers.get('upper')).toEqual(null);
  });

  it('should append values', () => {
    const headers = new Headers();
    headers.append('accept', 'application/json');
    headers.append('accept', 'text/javascript');
    expect(headers.get('accept')).toEqual('application/json,text/javascript');
  });

  it('should be iterable', () => {
    const headers = new Headers({
      accept: 'test',
      connection: 'test'
    });
    for (let value of headers) {
      expect(value).toEqual('test');
    }
  });

  it('should be iterable via `forEach`', () => {
    expect.assertions(2);

    const headers = new Headers({
      accept: 'test',
      connection: 'test'
    });

    headers.forEach(value => {
      expect(value).toEqual('test');
    });
  });
});
