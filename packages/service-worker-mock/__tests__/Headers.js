const Headers = require('../models/Headers');

describe('Headers', () => {
  it('should construct with no defaults', () => {
    const headers = new Headers();
    expect(headers.get('accept')).toEqual('');
  });

  it('should construct with defaults', () => {
    const headers = new Headers({ accept: '*/*' });
    expect(headers.get('accept')).toEqual('*/*');
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
});
