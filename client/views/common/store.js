import Store from './indexeddb.js';
export default new Store({
    name: 'test',
    version: 2,
    objectStores: ['feature', 'info', 'uuid', 'log']
});
