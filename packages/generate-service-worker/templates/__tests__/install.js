require('../install');

describe('[service-worker/templates] install', function test() {

  it('should register the install event', function() {
    const calls = global.self.addEventListener.mock.calls;
    expect(calls.length).toEqual(1);
    expect(calls[0][0]).toEqual('install');
  });

});
