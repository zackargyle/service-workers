const fs = require('fs');
const path = require('path');
const generateServiceWorkers = require('../generate-service-worker');
const generateRuntime = require('./utils/generateRuntime');
const mapPrecacheAssets = require('./utils/mapPrecacheAssets');

const runtimePath = path.resolve(__dirname, 'runtime.js');

function ProgressiveWebappPlugin(baseConfig, experimentConfigs) {
  this.baseConfig = baseConfig || {};
  this.experimentConfigs = experimentConfigs || {};
}

ProgressiveWebappPlugin.prototype.apply = function (compiler) {
  const publicPath = this.baseConfig.publicPath || compiler.options.output.publicPath;
  const writePath = this.baseConfig.writePath || compiler.options.output.path;

  // Write the runtime file
  const workerKeys = ['main'].concat(Object.keys(this.experimentConfigs));
  const generatedRuntime = generateRuntime(workerKeys, publicPath);
  fs.writeFileSync(runtimePath, generatedRuntime);

  // Generate service workers
  compiler.plugin('emit', (compilation, callback) => {
    // Update configs with matched precache asset paths
    const baseConfigWithPrecache = mapPrecacheAssets(compilation.assets, this.baseConfig);
    const expConfigsWithPrecache = Object.keys(this.experimentConfigs).reduce((result, key) => {
      // eslint-disable-next-line no-param-reassign
      result[key] = mapPrecacheAssets(compilation.assets, this.experimentConfigs[key]);
      return result;
    }, {});
    const serviceWorkers = generateServiceWorkers(baseConfigWithPrecache, expConfigsWithPrecache);

    // Write files to file system
    Object.keys(serviceWorkers).forEach(key => {
      const fullWritePath = path.join(writePath, `sw-${key}.js`);
      fs.writeFileSync(fullWritePath, serviceWorkers[key]);
    });

    callback();
  });
};

module.exports = ProgressiveWebappPlugin;
