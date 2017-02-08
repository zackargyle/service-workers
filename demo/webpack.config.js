const path = require("path");
const webpack = require('webpack');
const ServiceWorkerPlugin = require('../packages/service-worker-plugin');

const DEFAULT_SW_CONFIG = {
  writePath: path.join(process.cwd(), 'demo'),
  debug: true,
};

module.exports = {
  entry: {
      bundle: [
        'webpack-dev-server/client?http://localhost:3000/',
        path.join(process.cwd(), "packages/service-worker-plugin/index.js"),
        path.join(process.cwd(), "packages/service-worker-plugin/templates/runtime.js"),
        path.join(process.cwd(), "packages/generate-service-worker/index.js"),
        path.join(process.cwd(), "packages/generate-service-worker/templates/cache.js"),
        path.join(process.cwd(), "packages/generate-service-worker/templates/notifications.js"),
      ],
      runtime: [
        path.join(process.cwd(), "demo/index.js"),
      ]
  },
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: '/demo',
    filename: "[name].js"
  },
  externals: {
    "fs": true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ServiceWorkerPlugin(DEFAULT_SW_CONFIG, {
      withCache: Object.assign({}, DEFAULT_SW_CONFIG, {
        cache: {
          precache: [
            '.*\\.js$'
          ],
          strategy: [{
            type: 'prefer-cache',
            matches: ['.*\\.js$']
          }]
        },
      }),
      withNotifications: Object.assign({}, DEFAULT_SW_CONFIG, {
        notifications: {
          default: {
            title: 'SW Plugin',
            body: 'You’ve got everything working!',
            icon: 'https://developers.google.com/web/images/web-fundamentals-icon192x192.png',
            tag: 'default-push-notification',
            data: {
              url: 'https://github.com/pinterest/pwa',
            },
          },
        },
      })
    })
  ]
};
