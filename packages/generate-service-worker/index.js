const fs = require('fs');
const path = require('path');
const defaults = require('./utils/defaults');
const validate = require('./utils/validate');

const templatePath = path.join(__dirname, 'templates');
const installTemplate = fs.readFileSync(path.join(templatePath, 'install.js'), 'utf-8');
const notificationsTemplate = fs.readFileSync(path.join(templatePath, 'notifications.js'), 'utf-8');

function buildInstall() {
  return installTemplate;
}

function buildNotifications(options) {
  if (!options.notifications) {
    return '';
  }
  return notificationsTemplate;
}

module.exports = function buildServiceWorker(startArgs) {
  const options = validate(defaults(startArgs));
  const Cache = options.cache ? JSON.stringify(options.cache) : 'undefined';
  const Notifications = options.notifications ? JSON.stringify(options.notifications) : 'undefined';
  return [
    `const $Cache = ${Cache};`,
    `const $Notifications = ${Notifications};`,
    buildInstall(options),
    buildNotifications(options),
  ].join('\n');
};
