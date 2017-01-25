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

  var generatedServiceWorkers = generateServiceWorkers(this.baseConfig, this.experimentConfigs);
  var generatedRuntime = generateRuntime(generatedServiceWorkers, publicPath);
  // Write runtime file to disc
  fs.writeFileSync(runtimePath, generatedRuntime);

  compiler.plugin('emit', function ProgressiveWebappPluginAddFile(compilation, callback) {

    // Object.keys(generatedServiceWorkers).forEach(key => {
    //   compilation.assets[`sw-${key}.js`] = {
    //     source: () => generatedServiceWorkers[key],
    //     size: () => generatedServiceWorkers[key].length
    //   };
    // });

    // Write runtime to webpack
    compilation.assets[runtimePath] = {
      source: () => generatedRuntime,
      size: () => generatedRuntime.length,
    };
    callback();
  }.bind(this));

  // Force write the service workers to the file system
  compiler.plugin('done', function ProgressiveWebappPluginWriteFile(stats) {

    // Write service worker files to disc
    Object.keys(generatedServiceWorkers).forEach(key => {
      const fullOutPath = path.join(process.cwd(), publicPath, `sw-${key}.js`);
      fs.writeFileSync(fullOutPath, generatedServiceWorkers[key]);
    });
  }.bind(this));
};

module.exports = ProgressiveWebappPlugin;
