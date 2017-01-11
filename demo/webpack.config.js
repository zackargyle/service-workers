const path = require("path");
const webpack = require('webpack');
const ProgressiveWebappPlugin = require('../packages/progressive-webapp-plugin');

module.exports = {
  entry: {
      bundle: [
        'webpack-dev-server/client?http://localhost:3000/',
        path.join(process.cwd(), "packages/progressive-webapp-plugin/index.js"),
        path.join(process.cwd(), "packages/generate-service-worker/index.js"),
        path.join(process.cwd(), "packages/generate-service-worker/templates/cache.js"),
        path.join(process.cwd(), "packages/generate-service-worker/templates/notifications.js"),
      ]
  },
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: path.resolve(__dirname),
    filename: "[name].js"
  },
  externals: {
    "fs": "Number"
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ProgressiveWebappPlugin({
      cache: {}
    })
  ]
};
