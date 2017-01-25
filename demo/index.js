const runtime = require('../packages/progressive-webapp-plugin/runtime');

const node = document.getElementById('sw');

// Parse query parameters
const queryParams = location.search.substr(1).split('&').reduce((q, query) => {
  const [key, value] = query.split('=');
  return (q[key] = value, q);
}, {});

// Get service worker to register
const experimentKey = queryParams.key || 'main';
runtime.register(experimentKey);
runtime.requestNotificationsPermission();

// Inject service worker code to HTML for your viewing pleasure
fetch(`sw-${experimentKey}.js`)
  .then(res => res.text())
  .then(text => {
    node.innerHTML = text;
    hljs.highlightBlock(node);
  });
