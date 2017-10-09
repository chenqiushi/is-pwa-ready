import UAParser from 'ua-parser-js';
import store from 'store';
const parser = new UAParser();
const {browser, os, device, ua} = parser.getResult();

document.querySelector('.browser span').innerHTML = browser.name + ' ' + browser.version;
document.querySelector('.os span').innerHTML = os.name + ' ' + os.version;
document.querySelector('.device span').innerHTML = device.type + ' ' + device.model + ' ' + device.vendor;

export default async function () {
    await Promise.all([
        store.put('info', JSON.stringify(browser), 'browser'),
        store.put('info', JSON.stringify(os), 'os'),
        store.put('info', JSON.stringify(device), 'device'),
        store.put('info', JSON.stringify(ua), 'ua')
    ]);
    // await store.put('info', JSON.stringify(browser), 'browser');
    // await store.put('info', JSON.stringify(os), 'os');
    // await store.put('info', JSON.stringify(device), 'device');
    // await store.put('info', JSON.stringify(ua), 'ua');
}
