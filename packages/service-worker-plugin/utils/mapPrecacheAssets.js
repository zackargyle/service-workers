const isObject = (val) => val && !Array.isArray(val) && typeof val === 'object';

function deepCopy(obj) {
  var result = {};
  Object.keys(obj).forEach(key => {
    result[key] = isObject(obj[key]) ? deepCopy(obj[key]) : obj[key];
  });
  return result;
}

function mapPrecacheAssets(assets, _config, publicPath) {
  const config = deepCopy(_config);
  if (config.cache && config.cache.precache) {
    config.cache.precache = Object.keys(assets)
      .filter(asset => {
        return config.cache.precache.some(matcher => {
          const regex = new RegExp(matcher);
          return regex.test(asset);
        });
      })
      .map(asset => publicPath + asset);
  }
  return config;
}

module.exports = mapPrecacheAssets;
