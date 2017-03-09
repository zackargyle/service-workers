/* eslint-disable no-throw-literal */

function arrayOfTypeValidation(validator) {
  return withRequired(function arrayOfType(value) {
    if (!Array.isArray(value)) {
      throw `Value ${value} must be an array.`;
    }
    value.every(validator);
  });
}

function oneOfTypeValidation(types) {
  return withRequired(function oneOf(value) {
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
    if (list.indexOf(value) === -1) {
      throw `Value ${value} not a valid option from list: ${list.join(', ')}.`;
    }
  });
}

function shapeValidation(objShape) {
  return withRequired(function shape(value) {
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

function booleanValidation(value) {
  if (!value || typeof value !== 'boolean') {
    throw `Value ${value} must be of type "boolean".`;
  }
}

function objectValidation(value) {
  if (!value || typeof value !== 'object') {
    throw `Value ${value} must be non-null "object".`;
  }
}

function stringValidation(value) {
  if (typeof value !== 'string') {
    throw `Value ${value} must be of type "string".`;
  }
}

function numberValidation(value) {
  if (typeof value !== 'number') {
    throw `Value ${value} must be of type "number".`;
  }
}

function withRequired(_validator) {
  function validator(value) {
    return value === undefined || _validator(value);
  }

  validator.required = function requiredValidator(value) {
    if (value === undefined) {
      throw 'Value cannot be undefined.';
    }
    _validator(value);
  };
  return validator;
}

module.exports = {
  boolean: withRequired(booleanValidation),
  object: withRequired(objectValidation),
  number: withRequired(numberValidation),
  string: withRequired(stringValidation),
  arrayOfType: arrayOfTypeValidation,
  oneOf: oneOfValidation,
  oneOfType: oneOfTypeValidation,
  shape: shapeValidation
};
