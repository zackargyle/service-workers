jest.mock('mkdirp');
jest.mock('fs');

const ProgressiveWebappPlugin = require('../index');

const Compiler = function () {
  return {
    plugin: jest.fn(),
    options: {
      output: {
        path: '/',
        publicPath: '/'
      }
    }
  };
};

function runTest(_config) {
  // Run plugin.apply
  const config = _config || {};
  const plugin = new ProgressiveWebappPlugin(config.options || {}, config.experiments);
  const compiler = config.compiler || Compiler();
  const assets = config.assets || {};
  plugin.apply(compiler);

  // run the 'emit' callback
  const emitCallback = compiler.plugin.mock.calls[0][1];
  emitCallback({ assets: assets }, jest.fn());
  return assets;
}

describe('[progressive-webapp-plugin] index', function () {
  it('emits the sw-main file', function () {
    const assets = runTest();
    expect(assets['/sw-main.js']).toBeDefined();
  });

  it('emits experiment sw files', function () {
    const assets = runTest({ experiments: { test: {} } });
    expect(Object.keys(assets).length).toEqual(2);
    expect(assets['/sw-test.js']).toBeDefined();
  });

  it('prefixes precache assets with the publicPath', function () {
    const options = { cache: { precache: ['.*\\.js'] } };
    const compiler = Compiler();
    compiler.options.output.publicPath = 'https://i.cdn.com/';
    const assets = { 'test-file.js': 'var a = true' };
    runTest({ options, compiler, assets });
    expect(assets['/sw-main.js'].source().includes('https://i.cdn.com/test-file.js')).toEqual(true);
  });
});
