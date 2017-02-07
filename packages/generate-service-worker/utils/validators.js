const V = require('./validate');

const StrategyShape = V.shape({
  type: V.oneOf(['offline-only', 'fallback-only', 'prefer-cache', 'race']).required,
  matches: V.oneOfType([
    V.string,
    V.arrayOfType(V.string)
  ]).required
});

const CacheShape = V.shape({
  precache: V.arrayOfType(V.string),
  strategy: V.oneOfType([
    StrategyShape,
    V.arrayOfType(StrategyShape)
  ])
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
  duration: V.number
});

const LogShape = V.shape({
  installed: V.string,
  notificationClicked: V.string,
  notificationShown: V.string,
  requestOptions: V.object
});

const ConfigShape = V.shape({
  version: V.string,
  cache: CacheShape,
  notifications: NotificationsShape,
  log: LogShape
});

module.exports = {
  CacheShape: CacheShape,
  NotificationsShape: NotificationsShape,
  LogShape: LogShape,
  ConfigShape: ConfigShape
};
