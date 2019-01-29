const makeServiceWorkerEnv = require('../index');

describe('Trigger Event', () => {
  beforeEach(() => {
    Object.assign(global, makeServiceWorkerEnv());
    jest.resetModules();
  });

  it('can trigger a message event and wait until it is finished', async () => {
    const fn = jest.fn();
    self.addEventListener('message', (event) => {
      event.waitUntil(new Promise((resolve) => setTimeout(() => {
        fn();
        resolve();
      }, 20)));
    });

    await self.trigger('message');

    expect(fn).toHaveBeenCalled();
  });
});
