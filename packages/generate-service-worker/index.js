const fs = require('fs');
const path = require('path');
const defaults = require('./utils/defaults');
const ValidateConfigShape = require('./validators').ConfigShape;

const templatePath = path.join(__dirname, 'templates');

function buildMainTemplate(config) {
  return fs.readFileSync(path.join(templatePath, 'main.js'), 'utf-8');
}

function buildCacheTemplate(config) {
  if (!config.cache) {
    return '';
  }
  return fs.readFileSync(path.join(templatePath, 'cache.js'), 'utf-8');
}

function buildNotificationsTemplate(config) {
  if (!config.notifications) {
    return '';
  }
  return fs.readFileSync(path.join(templatePath, 'notifications.js'), 'utf-8');
}

function buildServiceWorker(config) {
  const Cache = config.cache ? JSON.stringify(config.cache) : 'undefined';
  const Notifications = config.notifications ? JSON.stringify(config.notifications) : 'undefined';
  return [
    `const $Cache = ${Cache};`,
    `const $Notifications = ${Notifications};`,
    `const $DEBUG = ${config.debug || false};`,
    buildMainTemplate(config),
    buildCacheTemplate(config),
    buildNotificationsTemplate(config),
  ].join('\n');
}

/*
 * Public API. This method will generate a root service worker and any number of
 * extended configuration service workers (used for testing/experimentation).
 * @returns Object { [key]: service-worker }
 */
module.exports = function generateServiceWorkers(baseConfig, experimentConfigs) {
  const rootConfig = defaults(baseConfig);
  ValidateConfigShape(rootConfig);

  const serviceWorkers = {
    main: buildServiceWorker(rootConfig),
  };

  if (experimentConfigs) {
    Object.keys(experimentConfigs).forEach(key => {
      const config = Object.assign({}, rootConfig, experimentConfigs[key]);
      ValidateConfigShape(config);
      serviceWorkers[key] = buildServiceWorker(config);
    });
  }
  return serviceWorkers;
};
