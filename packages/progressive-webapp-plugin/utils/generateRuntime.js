const fs = require('fs');
const path = require('path');
const runtimeTemplate = fs.readFileSync(path.join(__dirname, '..', 'templates', 'runtime.js'), 'utf-8');

function generateRuntime(serviceWorkers, publicPath) {
  return [
    `var $LocationMap = ${generateLocations(serviceWorkers, publicPath)}`,
    runtimeTemplate
  ].join('\n');
}

function generateLocations(serviceWorkers, publicPath) {
  const locationMap = Object.keys(serviceWorkers).reduce((locations, key) => {
    const location = path.join(publicPath, '..', `sw-${key}.js`);
    locations[key] = location;
    return locations;
  }, {});
  return JSON.stringify(locationMap, null, 2);
}

module.exports = generateRuntime;
