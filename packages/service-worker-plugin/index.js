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
  const writePath = this.baseConfig.writePath || compiler.options.output.path;

  // Write the runtime file
  const workerKeys = ['main'].concat(Object.keys(this.experimentConfigs || {}));
  const generatedRuntime = generateRuntime(workerKeys, publicPath);
  fs.writeFileSync(runtimePath, generatedRuntime);

  // Generate service workers
  compiler.plugin('emit', (compilation, callback) => {
    var generatedServiceWorkers = generateServiceWorkers(this.baseConfig, this.experimentConfigs);

    // Write files to file system
    Object.keys(generatedServiceWorkers).forEach(key => {
      const fullWritePath = path.join(writePath, `sw-${key}.js`);
      fs.writeFileSync(fullWritePath, generatedServiceWorkers[key]);
    });

    callback();
  });
};

module.exports = ProgressiveWebappPlugin;
