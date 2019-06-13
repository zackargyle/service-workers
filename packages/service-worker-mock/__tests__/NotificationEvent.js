const makeServiceWorkerEnv = require('../index');

describe('NotificationEvent', () => {
    beforeEach(() => {
        Object.assign(global, makeServiceWorkerEnv());
        jest.resetModules();
    });

    it('should properly initialize notification from args or args.notificaiton', () => {
        const args = {
            data: 'Test data'
        };

        const event = new NotificationEvent(args)
        expect(event.notification.data).toEqual(args.data)

        const args2 = {
            notification: { data: 'Test data 2' }
        };

        const event2 = new NotificationEvent(args2)
        expect(event2.notification.data).toEqual(args2.notification.data)
    });

    it('should properly initialize action', () => {
        const args = {
            action: 'test-action',
            notification: { data: 'Test data' }
        };

        const event = new NotificationEvent(args)
        expect(event.action).toEqual(args.action)
    });
});