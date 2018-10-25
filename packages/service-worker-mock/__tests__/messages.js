const makeServiceWorkerEnv = require('../index');

// https://github.com/GoogleChrome/samples/blob/gh-pages/service-worker/basic/service-worker.js
describe('messages', () => {
  beforeEach(() => {
    Object.assign(global, makeServiceWorkerEnv());
    jest.resetModules();
  });

  it('should properly send message', () => {
    Object.assign(global, makeServiceWorkerEnv());
    const testArguments = {
      type: 'test',
      value: 'value'
    };

    const event = new MessageEvent('message', testArguments);

    expect(event.data).toBeDefined();
    expect(event.data.type).toEqual(testArguments.type);
    expect(event.data.value).toEqual(testArguments.value);
  });
});
