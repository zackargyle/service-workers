function defaults(options) {
  return Object.assign({}, options, {
    notifications: options.notifications ?  Object.assign({
      duration: 5000
    }, options.notifications) : null,
  });
}

module.exports = defaults;
