const crypto = require('crypto');

function buildHashFromConfig(config) {
  return crypto
    .createHash('md5')
    .update(JSON.stringify(config))
    .digest('hex');
}

module.exports = buildHashFromConfig;
