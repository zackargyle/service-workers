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
  it('hook into the "emit" and "done" events', function () {
    const plugin = new ProgressiveWebappPlugin({ outPath: 'fake/path' });
    const compiler = Compiler();
    plugin.apply(compiler);

    const pluginCalls = compiler.plugin.mock.calls;
    expect(pluginCalls.length).toEqual(2);
    expect(pluginCalls[0][0]).toEqual('emit');
    expect(pluginCalls[1][0]).toEqual('done');
  });
});
