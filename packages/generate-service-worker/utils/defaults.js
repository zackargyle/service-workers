function defaults(options) {
  const withDefaults =  Object.assign({}, options);

  if (options.notifications) {
    withDefaults.notifications = Object.assign({
      duration: 5000
    }, options.notifications);
  }

  return withDefaults;
}

module.exports = defaults;
