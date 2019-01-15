const makeServiceWorkerEnv = require('../index');

describe('navigator', () => {
  beforeEach(() => {
    Object.assign(global, makeServiceWorkerEnv());
    jest.resetModules();
  });

  it('has a navigator mock with default userAgent', () => {
    expect(global).toHaveProperty('navigator');
    expect(global.navigator).toBeInstanceOf(Object);
    expect(global.navigator).toHaveProperty('userAgent', 'Mock User Agent');
  });

  it('takes a custom userAgent string from options', () => {
    Object.assign(global, makeServiceWorkerEnv({
      userAgent: 'Custom User Agent'
    }));

    expect(global).toHaveProperty('navigator');
    expect(global.navigator).toBeInstanceOf(Object);
    expect(global.navigator).toHaveProperty('userAgent', 'Custom User Agent');
  });
});
