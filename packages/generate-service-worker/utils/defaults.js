function defaults(options) {
  return Object.assign({}, options, {
    notifications: options.notifications ?  Object.assign({
      duration: 5000
    }, options.notifications) : undefined,
  });
}

module.exports = defaults;
