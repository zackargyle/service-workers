const V = require('../validate');

describe('[generate-service-worker/utils] validate', function () {
  it('V.string should pass for string', function () {
    expect(V.string.bind(null, 'test')).not.toThrow();
  });

  it('V.string should require a string', function () {
    expect(V.string.bind(null, 5)).toThrow('Value 5 must be of type "string".');
  });

  it('V.string should have a required property', function () {
    expect(V.string.required.bind(null, undefined)).toThrow('Value cannot be undefined.');
  });

  it('V.number should pass for number', function () {
    expect(V.number.bind(null, 5)).not.toThrow();
  });

  it('V.number should require a number', function () {
    expect(V.number.bind(null, 'test')).toThrow('Value test must be of type "number".');
  });

  it('V.number should have a required property', function () {
    expect(V.number.required.bind(null, undefined)).toThrow('Value cannot be undefined.');
  });

  it('V.shape should pass for valid array', function () {
    expect(V.shape({ test: V.string }).bind(null, { test: 'test' })).not.toThrow();
  });

  it('V.shape should throw if not of shape', function () {
    expect(V.shape({ test: V.string.required }).bind(null, {})).toThrow('Key: "test" failed with "Value cannot be undefined."');
  });

  it('V.shape should have a required property', function () {
    expect(V.shape(V.string).required.bind(null, undefined)).toThrow('Value cannot be undefined.');
  });

  it('V.arrayOf should pass for valid array', function () {
    expect(V.arrayOfType(V.string).bind(null, ['test'])).not.toThrow();
  });

  it('V.arrayOf should throw if not an array', function () {
    expect(V.arrayOfType(V.string).bind(null, 'test')).toThrow('Value test must be an array.');
  });

  it('V.arrayOf should throw if not of correct type', function () {
    expect(V.arrayOfType(V.string).bind(null, [5])).toThrow('Value 5 must be of type "string".');
  });

  it('V.arrayOf should have a required property', function () {
    expect(V.arrayOfType(V.string).required.bind(null, undefined)).toThrow('Value cannot be undefined.');
  });

  it('V.oneOfType should pass for listed value', function () {
    expect(V.oneOfType([V.string]).bind(null, 'test')).not.toThrow();
  });

  it('V.oneOfType should throw if value not in list', function () {
    expect(V.oneOfType([V.string]).bind(null, 5)).toThrow('Value 5 not a valid type.');
  });

  it('V.oneOfType should have a required property', function () {
    expect(V.oneOfType(V.string).required.bind(null, undefined)).toThrow('Value cannot be undefined.');
  });

  it('V.oneOf should pass for listed value', function () {
    expect(V.oneOf(['test']).bind(null, 'test')).not.toThrow();
  });

  it('V.oneOf should throw if value not in list', function () {
    expect(V.oneOf(['test']).bind(null, 5)).toThrow('Value 5 not a valid option from list: test.');
  });

  it('V.oneOf should have a required property', function () {
    expect(V.oneOf(['test']).required.bind(null, undefined)).toThrow('Value cannot be undefined.');
  });
});
