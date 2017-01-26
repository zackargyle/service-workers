const V = require('./utils/validate');

const StrategyShape = V.shape({
  type: V.oneOf(['offline-only','fallback-only','prefer-cache','race']).required,
  matches: V.oneOfType([
    V.string,
    V.arrayOfType(V.string)
  ]).required,
  // requestOptions: V.object
});

const CacheShape = V.shape({
  precache: V.arrayOfType(V.string),
  strategy: V.oneOfType([
    StrategyShape,
    V.arrayOfType(StrategyShape)
  ]),
});

const NotificationsShape = V.shape({
  default: V.shape({
    title: V.string.required,
    body: V.string,
    icon: V.string,
    tag: V.string,
    data: V.shape({
      url: V.string,
    }),
  }).required,
  fetchData: V.shape({
    url: V.string.required,
    // requestOptions: V.object,
  }),
  logClick: V.shape({
    url: V.string.required,
    // requestOptions: V.object,
  }),
  duration: V.number
});

const ConfigShape = V.shape({
  version: V.string,
  cache: CacheShape,
  notifications: NotificationsShape,
})

module.exports = {
  CacheShape: CacheShape,
  NotificationsShape: NotificationsShape,
  ConfigShape: ConfigShape,
};
