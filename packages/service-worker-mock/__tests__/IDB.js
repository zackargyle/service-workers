const {
  IDBFactory,
  IDBKeyRange,
  IDBDatabase,
  IDBObjectStore,
} = require('shelving-mock-indexeddb');
const makeServiceWorkerEnv = require('../index');

describe('IDB', () => {
  beforeEach(() => {
    Object.assign(global, makeServiceWorkerEnv());
    jest.resetModules();
  });

  // https://github.com/dhoulb/shelving-mock-indexeddb is test covered already,
  // so we are just going to check its exposure on the global mock
  it('has IDB mocks', () => {
    expect(global).toHaveProperty('indexedDB');
    expect(global.indexedDB).toBeInstanceOf(IDBFactory);
    expect(global).toHaveProperty('IDBKeyRange');
    expect(global.IDBKeyRange).toBe(IDBKeyRange);
    expect(global).toHaveProperty('IDBDatabase');
    expect(global.IDBDatabase).toBe(IDBDatabase);
    expect(global).toHaveProperty('IDBObjectStore');
    expect(global.IDBObjectStore).toBe(IDBObjectStore);
  })
});
