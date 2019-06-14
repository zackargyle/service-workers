const makeServiceWorkerEnv = require('../index');
const NotificationEvent = require('../models/NotificationEvent');

describe('NotificationEvent', () => {
  beforeEach(() => {
    Object.assign(global, makeServiceWorkerEnv());
    jest.resetModules();
  });

  it('should properly initialize notification from initial data', () => {
    const init = {
      notification: { data: 'Test data' }
    };

    const event = new NotificationEvent('notification', init);
    expect(event.notification.data).toEqual(init.notification.data);
  });

  it('should properly initialize action', () => {
    const init = {
      action: 'test-action'
    };

    const event = new NotificationEvent('notification', init);
    expect(event.action).toEqual(init.action);
  });
});
