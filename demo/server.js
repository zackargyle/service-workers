var WebpackDevServer = require("webpack-dev-server");
var webpack = require("webpack");
var config = require('./webpack.config');

var compiler = webpack(config);

var server = new WebpackDevServer(compiler, {
  contentBase: 'demo',
  inline: true,
  filename: 'bundle.js',
  publicPath: '/',
  stats: { colors: true },
});
server.listen(3000, "localhost", function() {});
