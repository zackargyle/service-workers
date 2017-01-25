const runtime = require('../packages/progressive-webapp-plugin/runtime');

const node = document.getElementById('sw');
const queryParams = location.search.substr(1).split('&').reduce((q, query) => {
  const [key, value] = query.split('=');
  return (q[key] = value, q);
}, {});
const key = queryParams.key || 'main';
fetch(`sw-${key}.js`)
  .then(res => res.text())
  .then(text => {
    node.innerHTML = text;
    hljs.highlightBlock(node);
  });

runtime.register(key);
