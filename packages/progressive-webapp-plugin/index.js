const fs = require('fs');
const path = require('path');
const generateServiceWorkers = require('../generate-service-worker');

function ProgressiveWebappPlugin(baseConfig, experimentConfigs) {
  this.baseConfig = baseConfig || {};
  this.experimentConfigs = experimentConfigs || null;
}

ProgressiveWebappPlugin.prototype.apply = function (compiler) {
  var generatedServiceWorkers = {};
  compiler.plugin('emit', function ProgressiveWebappPluginAddFile(compilation, callback) {
    generatedServiceWorkers = generateServiceWorkers(this.baseConfig, this.experimentConfigs);
    Object.keys(generatedServiceWorkers).forEach(key => {
      compilation.assets[`sw-${key}.js`] = {
        source: () => generatedServiceWorkers[key],
        size: () => generatedServiceWorkers[key].length
      };
    });
    callback();
  }.bind(this));

  // Force write the service worker to the file system
  compiler.plugin('done', function ProgressiveWebappPluginWriteFile(stats) {
    const publicPath = this.baseConfig.publicPath || compiler.options.output.publicPath;
    Object.keys(generatedServiceWorkers).forEach(key => {
      const fullOutPath = path.join(publicPath, `sw-${key}.js`);
      fs.writeFileSync(fullOutPath, generatedServiceWorkers[key]);
    });
  }.bind(this));
};

module.exports = ProgressiveWebappPlugin;
