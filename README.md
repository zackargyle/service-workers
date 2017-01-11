# Progressive Webapp Plugin for Webpack

<DESCRIPTION>

```
npm install --save progressive-webapp-plugin
```

Use:
```js
new ProgressiveWebappPlugin({
  outPath: '',
  notifications: {
    tagFormat: 'base:action_type:link',
    fetchUrl: '_/_/push/web_push_content/:subscription_id',
    logClickUrl: '_/_/push/web_push_click/:subscription_id/:action_type',
  }
})
```

### Options
option          | description
--------------- | -----------
`outPath`       | The path to the built file
`notifications` | An optional config to enable web notification

### Scripts
script         | description
-------------- | -----------
`npm start`    | run the demo on `localhost:3000`
`npm run test` | run the test suite
`npm run lint` | run the linter

### Patrons
* [Zack Argyle](https://github.com/zackargyle)

>Be the first to contribute!
>✌⊂(✰‿✰)つ✌

**Some ideas for contributions:**
* ?

## License
[MIT](http://isekivacenz.mit-license.org/)
