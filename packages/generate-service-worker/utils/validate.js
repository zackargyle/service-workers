function validate(options) {
  if (options.notifications) {
    const notifs = options.notifications;
    if (!notifs.fetchUrl || typeof notifs.fetchUrl !== 'string') {
      throw new Error('options.notifications.fetchUrl must be a string');
    }
    if (!notifs.logClickUrl || typeof notifs.logClickUrl !== 'string') {
      throw new Error('options.notifications.logClickUrl must be a string');
    }
    if (typeof notifs.duration !== 'number' || notifs.duration < 0) {
      throw new Error('options.notifications.duration must be a positive number, got ' + notifs.duration);
    }
  }
  return options;
}

module.exports = validate;
