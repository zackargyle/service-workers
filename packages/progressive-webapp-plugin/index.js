const generateServiceWorker = require('../generate-service-worker');

function ProgressiveWebappPlugin(options) {
  this.options = options;
}

ProgressiveWebappPlugin.prototype.apply = function (compiler) {
  const generatedServiceWorker = generateServiceWorker(this.options);
  compiler.plugin('emit', function ProgressiveWebappPluginAddFile(compilation, callback) {
    compilation.assets['service-worker.js'] = {
      source: () => generatedServiceWorker,
      size: () => generatedServiceWorker.length
    };
    callback();
  }.bind(this));

  // Force write the service worker to the file system
  compiler.plugin('done', function ProgressiveWebappPluginWriteFile(stats) {
    const path = this.options.publicPath || compiler.options.publicPath;
    const fullOutPath = path.join(this.options.publicPath, 'service-worker.js');
    fs.writeFileSync(fullOutPath, generatedServiceWorker);
  }.bind(this));
};

module.exports = ProgressiveWebappPlugin;
