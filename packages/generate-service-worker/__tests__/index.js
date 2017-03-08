const path = require('path');
const generateServiceWorkers = require('../index');

const customTemplateCode = 'var foo = "bar";';
const customTemplatePath = path.join(__dirname, 'mockTemplate');
const configs = {
  default: {},
  invalid: { notifications: { fetchData: 1 } },
  custom: {
    main: { template: customTemplatePath },
    cache: { cache: {
      template: customTemplatePath
    } },
    notifications: { notifications: {
      default: { title: 'test' },
      template: customTemplatePath
    } }
  },
  notifications: {
    notifications: {
      default: {
        title: 'test'
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

  describe('> custom templates', () => {
    it('should allow custom main templates', () => {
      const sw = generateServiceWorkers(configs.custom.main).main;
      expect(sw.includes(customTemplateCode)).toEqual(true);
    });

    it('should allow custom cache templates', () => {
      const sw = generateServiceWorkers(configs.custom.cache).main;
      expect(sw.includes(customTemplateCode)).toEqual(true);
    });

    it('should allow custom notifications templates', () => {
      const sw = generateServiceWorkers(configs.custom.notifications).main;
      expect(sw.includes(customTemplateCode)).toEqual(true);
    });
  });

  it('should generate a service worker ', function () {
    // Object.keys(configs).forEach(function (name) {
    //   const options = configs[name];
    //   expect(generateServiceWorkers(options)).toMatchSnapshot(`service-worker-config-${name}`);
    // });
  });
});
