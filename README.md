# Progressive Webapp Plugin for Webpack

<DESCRIPTION>

### Scripts for development
script         | description
-------------- | -----------
`yarn install` | install all dev dependencies
`npm test`     | run the test suite
`npm run lint` | run the linter

## Contains the following packages

`generate-service-worker`: A node module for generating a service worker file based on provided configuration options.
User:
```js
> node
> require('./packages/generate-service-worker/index.js')({})
```

`progressive-webapp-plugin`: A webpack plugin for generating service worker files. Includes full support for caching, notifications, homescreen installs, and more.
Use:
```js
new ProgressiveWebappPlugin({
  publicPath: 'some/path',
  cache: {
    ...
  },
  notifications: {
    ...
  }
});
```

### Patrons
* [Zack Argyle](https://github.com/zackargyle)

>Be the first to contribute!
>✌⊂(✰‿✰)つ✌

**Some ideas for contributions:**
* ?

## License
[MIT](http://isekivacenz.mit-license.org/)
