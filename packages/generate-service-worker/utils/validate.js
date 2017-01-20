function arrayOfType(validator) {
  return withRequired(function arrayOfTypeValidation(value) {
    if (!Array.isArray(value)) {
      throw `Value ${value} must be an array.`;
    }
    value.every(validator)
  });
}

function oneOfType(types) {
  return withRequired(function oneOfValidation(value) {
    const isValidType = types.some(function(Type) {
      try {
        Type(value);
        return true;
      } catch(e) {
        return false;
      }
    });
    if (!isValidType) {
      throw `Value ${value} not a valid type.`;
    }
  });
}

function oneOf(list) {
  return withRequired(function oneOfValidation(value) {
    if (list.indexOf(value) === -1) {
      throw `Value ${value} not a valid option from list: ${list.join(', ')}.`;
    }
  });
}

function shape(objShape) {
  return withRequired(function shapeValidation(value) {
    if (value && typeof value !== 'object') {
      throw `Value <${value}> must be an object.`;
    }
    try {
      Object.keys(objShape).forEach(function shapeKeyValidation(key) {
        objShape[key](value[key]);
      });
    } catch(e) {
      throw `Value ${JSON.stringify(value)} has an invalid shape.\n${e}`;
    }
  });
}

function assertOfType(type) {
  return withRequired(function assertOfTypeValidation(value) {
    if (typeof value !== type) {
      throw `Value ${value} must be of type "${type}".`;
    }
  });
}

function withRequired(validator) {
  validator.required = function requiredValidator(value) {
    if (value === undefined || value === null) {
      throw `Value is required.`;
    }
    validator(value);
  }
  return validator;
}

module.exports = {
  arrayOfType: arrayOfType,
  number: assertOfType('number'),
  oneOf: oneOf,
  oneOfType: oneOfType,
  shape: shape,
  string: assertOfType('string')
};
