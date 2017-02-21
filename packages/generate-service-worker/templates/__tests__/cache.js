const makeServiceWorkerEnv = require('../../../service-worker-mock');
const fixtures = require('../../../../testing/fixtures');
// Injected vars
global.$VERSION = '18asd9a8dfy923';
const CURRENT_CACHE = `SW_CACHE:${$VERSION}`;

describe('[generate-service-worker/templates] cache', function test() {
  beforeEach(() => {
    Object.assign(global, makeServiceWorkerEnv());
    global.$Cache = fixtures.$Cache();
    jest.resetModules();
    global.fetch.mockClear();
    require('../cache');
  });

  it('should register the install event', function () {
    expect(self.listeners.install[0].name).toEqual('handleInstall');
    expect(self.listeners.activate[0].name).toEqual('handleActivate');
  });

  describe('handleInstall', () => {
    it('[without prefetch] should skip waiting', async () => {
      global.$Cache.precache = undefined;
      expect(self.snapshot().caches.hasOwnProperty(CURRENT_CACHE)).toEqual(false);
      await self.trigger('install');
      expect(self.snapshot().caches.hasOwnProperty(CURRENT_CACHE)).toEqual(false);
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
