const V = require('./validate');

const StrategyShape = V.shape({
  type: V.oneOf(['offline-only', 'fallback-only', 'prefer-cache', 'race']).required,
  matches: V.arrayOfType(V.string).required
});

const CacheShape = V.shape({
  offline: V.boolean,
  precache: V.arrayOfType(V.string),
  strategy: V.arrayOfType(StrategyShape)
});

const NotificationsShape = V.shape({
  default: V.shape({
    title: V.string.required,
    body: V.string,
    icon: V.string,
    tag: V.string,
    data: V.shape({
      url: V.string
    })
  }).required,
  duration: V.number,
  fallbackURL: V.string
});

const LogShape = V.shape({
  installed: V.string,
  notificationClicked: V.string,
  notificationReceived: V.string,
  requestOptions: V.object
});

function validate(config) {
  if (!config.template) {
    if (config.cache && !config.cache.template) {
      CacheShape(config.cache);
    }
    if (config.notifications && !config.notifications.template) {
      NotificationsShape(config.notifications);
    }
    if (config.log) {
      LogShape(config.log);
    }
  }
}

module.exports = {
  CacheShape: CacheShape,
  NotificationsShape: NotificationsShape,
  LogShape: LogShape,
  validate: validate
};
