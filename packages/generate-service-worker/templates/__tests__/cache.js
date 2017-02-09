const fixtures = require('../../../../testing/fixtures');
// Injected vars
global.$Cache = fixtures.$Cache();
global.$Version = '18asd9a8dfy923';
// Import main module
const sw = require('../cache');

describe('[generate-service-worker/templates] cache', function test() {
  beforeEach(() => {
    global.$Cache = fixtures.$Cache();
    global.clients.claim.mockClear();
    global.caches.keys.mockClear();
    global.caches.delete.mockClear();
    global.caches.open.mockClear();
    global.fetch.mockClear();
  });

  it('should register the install event', function () {
    const calls = global.self.addEventListener.mock.calls;
    expect(calls.length).toEqual(2);
    expect(calls[0][0]).toEqual('install');
    expect(calls[1][0]).toEqual('activate');
  });

  describe('handleInstall', () => {
    it('[without prefetch] should skip waiting and claim clients', () => {
      global.$Cache.precache = undefined;
      sw.handleInstall(fixtures.Event());
      expect(global.self.skipWaiting.mock.calls.length).toEqual(1);
    });

    it('[with prefetch] should prefetch assets', () => {

    });

    it('[with prefetch] should claim clients after prefetch', () => {

    });
  });

  describe('handleActivate', () => {
    it('should skip waiting if no prefetch required', () => {

    });
  });

  describe('handleFetch', () => {
    it('should skip waiting if no prefetch required', () => {

    });
  });

  describe('applyEventStrategy', () => {
    it('should skip waiting if no prefetch required', () => {

    });
  });

  describe('getStrategyForUrl', () => {
    it('should skip waiting if no prefetch required', () => {

    });
  });

  describe('insertInCache', () => {
    it('should skip waiting if no prefetch required', () => {

    });
  });

  describe('getFromCache', () => {
    it('should skip waiting if no prefetch required', () => {

    });
  });

  describe('fetchAndCache', () => {
    it('should skip waiting if no prefetch required', () => {

    });
  });

  describe('fallbackToCache', () => {
    it('should skip waiting if no prefetch required', () => {

    });
  });

  describe('getFromFastest', () => {
    it('should skip waiting if no prefetch required', () => {

    });
  });

  describe('prefetch', () => {
    it('should skip waiting if no prefetch required', () => {

    });
  });
});
