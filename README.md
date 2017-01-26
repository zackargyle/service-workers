Progressive Webapp Toolchain
=========================

A collection of service worker generation tools. 
Configurable and forkable.

## Includes the following packages

### [generate-service-worker](https://github.com/pinterest/pwa/tree/master/packages/generate-service-worker/README.md)
A node module for generating service worker files based on provided configuration options.

### [progressive-webapp-plugin](https://github.com/pinterest/pwa/tree/master/packages/progressive-webapp-plugin/README.md)
A webpack plugin for generating dynamic service worker files and a runtime helper.


## Contributing

scripts        | description
-------------- | -----------
`yarn install` | install all dev dependencies
`yarn test`    | run the test suite
`yarn run lint`| run eslint
`yarn start`   | run the demo for development testing

To get started contributing, run `yarn start`, which will run a webpack-devserver on `localhost:3000`. In `demo/webpack.config.js` you'll see the configurations used for the demo testing. Each experimental config can be accessed via the `key` query param (i.e. `localhost:3000?key=with-notifications`). This provides a simple way to install a new service worker for testing, and the corresponding generated code will be visible in the DOM itself thanks to [highlight.js](https://highlightjs.org/). Use the `application` tab in the devtools to verify that the service worker was installed. By setting `debug: true` in the plugin config, the devtools console can be used to verify actions are taking place.

## Patrons
* [Zack Argyle](https://github.com/zackargyle)

>Be the first to contribute!
>✌⊂(✰‿✰)つ✌

**Some ideas for contributions:**
* Browserify plugin
* Rollup plugin

## License
[MIT](http://isekivacenz.mit-license.org/)
