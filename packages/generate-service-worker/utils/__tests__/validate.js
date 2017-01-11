const validate = require('../validate');

describe('[service-worker/utils] validate', function() {
  it('should throw when missing fetchUrl if notifications is present', function() {
    expect(validate.bind(null, {
      outPath: 'fake/path',
      notifications: {}
    })).toThrow('options.notifications.fetchUrl must be a string');
  });

  it('should throw when missing logClickUrl', function() {
    expect(validate.bind(null, {
      outPath: 'fake/path',
      notifications: {
        fetchUrl: 'fake/path'
      }
    })).toThrow('options.notifications.logClickUrl must be a string');
  });

  it('should throw when duration is an invalid number', function() {
    expect(validate.bind(null, {
      outPath: 'fake/path',
      notifications: {
        fetchUrl: 'fake/path',
        logClickUrl: 'fake/path',
        duration: -1
      }
    })).toThrow('options.notifications.duration must be a positive number, got -1');
  });
});
