const generateServiceWorkers = require('../index');

const configs = {
  default: {},
  invalid: { notifications: { fetchData: 1 } },
  notifications: {
    notifications: {
      default: {
        title: 'test'
      },
      fetchData: {
        url: 'fake/path'
      },
      logClick: {
        url: 'fake/path'
      }
    }
  },
  cache: {
    cache: {
      precache: ['/test\\.js'],
      strategy: [{
        type: 'prefer-cache',
        matches: ['*.js']
      }]
    }
  }
};

describe('[generate-service-worker] index', function () {
  it('should generate a main service worker', function () {
    const serviceWorkers = generateServiceWorkers(configs.default);
    expect(serviceWorkers.main).toBeDefined();
  });

  it('should generate experimental service workers', function () {
    const serviceWorkers = generateServiceWorkers(configs.default, {
      'with-notifications': configs.notifications,
      'with-cache': configs.cache
    });
    expect(serviceWorkers.main).toBeDefined();
    expect(serviceWorkers['with-notifications']).toBeDefined();
    expect(serviceWorkers['with-cache']).toBeDefined();
  });

  it('should throw for invalid root configurations', function () {
    expect(generateServiceWorkers.bind(null, configs.invalid)).toThrow();
  });

  it('should throw for invalid experiment configurations', function () {
    expect(generateServiceWorkers.bind(null, {}, { test: configs.invalid })).toThrow();
  });

  it('should generate a service worker ', function () {
    // Object.keys(configs).forEach(function (name) {
    //   const options = configs[name];
    //   expect(generateServiceWorkers(options)).toMatchSnapshot(`service-worker-config-${name}`);
    // });
  });
});
