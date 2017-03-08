self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

console.log('HELLO FROM A CUSTOM TEMPLATE!');
