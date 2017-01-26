const defaults = require('../defaults');

describe('[generate-service-worker/utils] defaults', function() {
  it('should provide default options', function() {
    expect(defaults({})).toEqual({});
  });

  it('should provide default notification options', function() {
    expect(defaults({ notifications: {} })).toEqual({
      notifications: {
        duration: 5000
      }
    });
  });
});
