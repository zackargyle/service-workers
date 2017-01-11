// const generateServiceWorker = require('../index');
//
// const configurations = {
//   'default': {},
//   'default-notifications': {
//     notifications: {
//       fetchUrl: '/fetch/url',
//       logClickUrl: '/logclick/url'
//     }
//   }
// };
//
// describe('[service-worker] index', function() {
//   it('should generate a service worker ', function() {
//     Object.keys(configurations).forEach(function(name) {
//       const options = configurations[name];
//       expect(generateServiceWorker(options)).toMatchSnapshot(`service-worker-config-${name}`);
//     });
//   });
// });
