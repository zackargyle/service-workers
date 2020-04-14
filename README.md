# *** THIS PROJECT IS NO LONGER MAINTAINED ***


Service Worker Toolchain
=========================

A collection of service worker generation tools.
Configurable and forkable.

## Includes the following packages

### [generate-service-worker](https://github.com/pinterest/service-workers/tree/master/packages/generate-service-worker)
A node module for generating service worker files based on provided configuration options.

### [service-worker-plugin](https://github.com/pinterest/service-workers/tree/master/packages/service-worker-plugin)
A webpack plugin for generating dynamic service worker files and a runtime helper.

### [service-worker-mock](https://github.com/pinterest/service-workers/tree/master/packages/service-worker-mock)
A mock service worker environment generator. Used for testing service worker code.

## Why?
There are several other packages that generate service workers ([sw-precache](https://github.com/GoogleChrome/sw-precache), [offline-plugin](https://github.com/NekR/offline-plugin/), etc). This collection of tools was built to allow more complexity while being fully testable, and allowing the generation of multiple service worker files simultaneously for experimentation/rollout. We chose not to use a templating language, but to instead inject globals into the scripts so that our "templates" were pure JavaScript. This makes it easier to test/read/update the code, with the downside of slightly larger output sizes. See the README in each package for more details.

We encourage forking of the base templates found in [packages/generate-service-worker/templates/](https://github.com/pinterest/service-workers/tree/master/packages/generate-service-worker/templates).


## Contributing

scripts        | description
-------------- | -----------
`yarn install` | install all dev dependencies
`yarn test`    | run the test suite
`yarn run lint`| run eslint
`yarn start`   | run the demo for development testing

To get started contributing, run `yarn start`, which will run a webpack-devserver on `localhost:3000`. In `demo/webpack.config.js` you'll see the configurations used for the demo testing. Each experimental config can be accessed via the `key` query param (i.e. `localhost:3000?key=withNotifications`). This provides a simple way to install a new service worker for testing, and the corresponding generated code will be visible in the DOM itself thanks to [highlight.js](https://highlightjs.org/). Use the `application` tab in the devtools to verify that the service worker was installed. By setting `debug: true` in the plugin config, the devtools console can be used to verify actions are taking place.

## Core Contributors
* [Zack Argyle](https://github.com/zackargyle)
* [Yen-Wei Liu](https://github.com/bishwei)
* [Sebastian Herrlinger](https://github.com/kommander)

## Contributors ✌⊂(✰‿✰)つ✌
* [Doug Reeder](https://github.com/DougReeder)
* [Jeff Posnick](https://github.com/jeffposnick)
* [Matt Gaunt](https://github.com/gauntface)
* [Joseph Liccini](https://github.com/josephliccini)
* [Jonathan Creamer](https://github.com/jcreamer898)
* [Brad Erickson](https://github.com/13rac1)
* [Bryan Lee](https://github.com/bryclee)
* [Jimmy King](https://github.com/10xlacroixdrinker)
* [Domingos Martins](https://github.com/DomingosMartins)
* [André Naves](https://github.com/andrefgneves)
* [kontrollanten](https://github.com/kontrollanten)
* [cjies](https://github.com/cjies)
* [sreedhard7](https://github.com/sreedhar7)
* [koenvg](https://github.com/koenvg)
* [pwwpche](https://github.com/pwwpche)
* [jelly972](https://github.com/jelly972)

**Some ideas for contributions:**
* Browserify plugin
* Rollup plugin

## License
[MIT](http://isekivacenz.mit-license.org/)
