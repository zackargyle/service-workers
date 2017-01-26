/* eslint-disable no-throw-literal */

function arrayOfTypeValidation(validator) {
  return withRequired(function arrayOfType(value) {
    if (value == null) return;
    if (!Array.isArray(value)) {
      throw `Value ${value} must be an array.`;
    }
    value.every(validator);
  });
}

function oneOfTypeValidation(types) {
  return withRequired(function oneOf(value) {
    if (value == null) return;
    const isValidType = types.some(function (Type) {
      try {
        Type(value);
        return true;
      } catch (e) {
        return false;
      }
    });
    if (!isValidType) {
      throw `Value ${value} not a valid type.`;
    }
  });
}

function oneOfValidation(list) {
  return withRequired(function oneOf(value) {
    if (value == null) return;
    if (list.indexOf(value) === -1) {
      throw `Value ${value} not a valid option from list: ${list.join(', ')}.`;
    }
  });
}

function shapeValidation(objShape) {
  return withRequired(function shape(value) {
    if (value == null) return;
    if (value && typeof value !== 'object') {
      throw `Value <${value}> must be an object.`;
    }
    Object.keys(objShape).forEach(function shapeKeyValidation(key) {
      try {
        objShape[key](value[key]);
      } catch (e) {
        if (objShape[key].name === 'shape') {
          throw e;
        } else {
          throw `Key: "${key}" failed with "${e}"`;
        }
      }
    });
  });
}

function assertOfTypeValidation(type) {
  return withRequired(function assertOfType(value) {
    if (value == null) return;
    // eslint-disable-next-line valid-typeof
    if (typeof value !== type) {
      throw `Value ${value} must be of type "${type}".`;
    }
  });
}

function withRequired(validator) {
  // eslint-disable-next-line no-param-reassign
  validator.required = function requiredValidator(value) {
    if (value == null) {
      throw 'Value is required.';
    }
    validator(value);
  };
  return validator;
}

module.exports = {
  arrayOfType: arrayOfTypeValidation,
  number: assertOfTypeValidation('number'),
  oneOf: oneOfValidation,
  oneOfType: oneOfTypeValidation,
  shape: shapeValidation,
  string: assertOfTypeValidation('string')
};
