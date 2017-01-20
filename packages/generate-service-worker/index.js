const fs = require('fs');
const path = require('path');
const defaults = require('./utils/defaults');
const OptionsShape = require('./validators').OptionsShape;

const templatePath = path.join(__dirname, 'templates');

function buildCacheTemplate(options) {
  if (!options.cache) {
    return '';
  }
  return fs.readFileSync(path.join(templatePath, 'cache.js'), 'utf-8');
}

function buildNotificationsTemplate(options) {
  if (!options.notifications) {
    return '';
  }
  return fs.readFileSync(path.join(templatePath, 'notifications.js'), 'utf-8');
}

module.exports = function buildServiceWorker(startArgs) {
  const options = defaults(startArgs);
  // Validate configuration shape
  OptionsShape(options);

  const Cache = options.cache ? JSON.stringify(options.cache) : 'undefined';
  const Notifications = options.notifications ? JSON.stringify(options.notifications) : 'undefined';
  return [
    `const $Cache = ${Cache};`,
    `const $Notifications = ${Notifications};`,
    buildCacheTemplate(options),
    buildNotificationsTemplate(options),
  ].join('\n');
};
