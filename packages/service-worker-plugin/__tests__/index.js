jest.mock('mkdirp');

const ProgressiveWebappPlugin = require('../index');

const Compiler = function () {
  return {
    plugin: jest.fn(),
    options: {
      output: {
        publicPath: '/'
      }
    }
  };
};

describe('[progressive-webapp-plugin] index', function () {
  it('hook into the "emit" event', function () {
    const plugin = new ProgressiveWebappPlugin({ outPath: 'fake/path' });
    const compiler = Compiler();
    plugin.apply(compiler);

    const pluginCalls = compiler.plugin.mock.calls;
    expect(pluginCalls.length).toEqual(1);
    expect(pluginCalls[0][0]).toEqual('emit');
  });
});
