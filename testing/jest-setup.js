const Subscription = require('./fixtures').Subscription;
const Cache = require('./fixtures').Cache;

const noop = () => {};

// Browser globals
global.URL = jest.fn(url => ({ search: url }));
global.Request = jest.fn(() => ({ url: '/' }));
global.fetch = jest.fn(() => Promise.resolve({ status: 200 }));

global.logger = {
  group: noop,
  groupEnd: noop,
  log: noop,
  warn: noop,
  error: noop,
};
