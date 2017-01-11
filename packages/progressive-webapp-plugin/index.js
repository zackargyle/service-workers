const fs = require('fs');
const path = require('path');
const generateServiceWorker = require('../generate-service-worker');

function ProgressiveWebappPlugin(options) {
  this.options = options || {};
}

ProgressiveWebappPlugin.prototype.apply = function (compiler) {
  var generatedServiceWorker;
  compiler.plugin('emit', function ProgressiveWebappPluginAddFile(compilation, callback) {
    generatedServiceWorker = generateServiceWorker(this.options);
    compilation.assets['service-worker.js'] = {
      source: () => generatedServiceWorker,
      size: () => generatedServiceWorker.length
    };
    callback();
  }.bind(this));

  // Force write the service worker to the file system
  compiler.plugin('done', function ProgressiveWebappPluginWriteFile(stats) {
    const publicPath = this.options.publicPath || compiler.options.output.publicPath;
    const fullOutPath = path.join(publicPath, 'service-worker.js');
    fs.writeFileSync(fullOutPath, generatedServiceWorker);
  }.bind(this));
};

module.exports = ProgressiveWebappPlugin;
