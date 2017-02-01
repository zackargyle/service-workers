const path = require("path");
const webpack = require('webpack');
const ServiceWorkerPlugin = require('../packages/service-worker-plugin');

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
    new ServiceWorkerPlugin({ debug: true }, {
      'with-cache': {
        cache: {
          precache: [
            '*.css'
          ],
          strategy: [{
            type: 'prefer-cache',
            matches: '*.js'
          }]
        },
      },
      'with-notifications': {
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
      }
    })
  ]
};
