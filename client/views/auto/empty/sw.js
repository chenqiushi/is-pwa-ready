import {registerConsole} from 'utils';

registerConsole();

console.log('i am empty');

self.addEventListener('install', function (event) {
    console.log('Install event empty', event);
    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    console.log('Activate event empty', event);
});
