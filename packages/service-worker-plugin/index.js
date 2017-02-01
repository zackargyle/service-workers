const fs = require('fs');
const path = require('path');
const generateServiceWorkers = require('../generate-service-worker');
const generateRuntime = require('./utils/generateRuntime');

const runtimePath = path.resolve(__dirname, 'runtime.js');

function ProgressiveWebappPlugin(baseConfig, experimentConfigs) {
  this.baseConfig = baseConfig || {};
  this.experimentConfigs = experimentConfigs || null;
}

ProgressiveWebappPlugin.prototype.apply = function (compiler) {
  const publicPath = this.baseConfig.publicPath || compiler.options.output.publicPath;

  // These only change if the webpack config changes, so do them here.
  var generatedServiceWorkers = generateServiceWorkers(this.baseConfig, this.experimentConfigs);
  var generatedRuntime = generateRuntime(generatedServiceWorkers, publicPath);
  // Write runtime file to disc
  fs.writeFileSync(runtimePath, generatedRuntime);

  // Write runtime to webpack
  compiler.plugin('emit', function ProgressiveWebappPluginAddFile(compilation, callback) {
    // eslint-disable-next-line no-param-reassign
    compilation.assets[runtimePath] = {
      source: () => generatedRuntime,
      size: () => generatedRuntime.length
    };
    callback();
  });

  // Force write the service workers to the file system
  compiler.plugin('done', function ProgressiveWebappPluginWriteFile() {
    Object.keys(generatedServiceWorkers).forEach(key => {
      const fullOutPath = path.join(process.cwd(), publicPath, `sw-${key}.js`);
      fs.writeFileSync(fullOutPath, generatedServiceWorkers[key]);
    });
  });
};

module.exports = ProgressiveWebappPlugin;
