import test from './test';
import {registerConsole} from 'utils';

registerConsole();
test(self);

self.addEventListener('install', function (event) {
    console.log('Install event global', event);
    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    console.log('Activate event global', event);
});