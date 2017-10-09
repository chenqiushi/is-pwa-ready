// import './main.css';
import '../common/index';
import globalTest from './global/main';
import empty from './empty/main';
import postmessageTest from './postmessage/main';
import lifecycleTest from './lifecycle/main';
import syncTest from './sync/main';
import result from './result/main';
import init from './init/main';
import env from './env/main';
import summary from './summary/main';
import cache from './cache/main';
import push from './push/main';
import {search2obj, obj2search, uuid, isNumeric} from 'utils';
import store from 'store';
import axios from 'axios';
import './main.css';
// import 'vconsole';
import {info, infoKeys} from './helper';
import 'views/common/raven';

window.addEventListener('unhandledrejection', function (event) {
    let str = JSON.stringify(event);
    let div = document.createElement('div');
    div.style.wordBreak = 'break-all';
    div.innerHTML = str;
    document.body.appendChild(div);
    console.warn('WARNING: Unhandled promise rejection. Shame on you! Reason: ' + event.reason);
});

document.querySelector('.test-again').addEventListener('click', function (e) {
  main();
});

info.totalSchedule = 8;
const {step = '0'} = search2obj();

main();

async function main() {

    // 如果是step=1刷新，则重定向到step=0，重新走测试流程
    if (step === '1' && localStorage.getItem('from') !== 'step0') {
        const search = search2obj();
        location.search = obj2search(Object.assign(search, {step: '0'}));
    }

    switch (step) {
        case '0':
            localStorage.setItem('from', 'step0');
            await init();
            await env();
            await result();
            await globalTest();
            await result();
            await empty();
            return;
        case '1':
            await result();
            await lifecycleTest();
            await result();
            await postmessageTest();
            await result();
            await syncTest();
            await result();
            await cache();
            await result();
            await push();
            await result();
            await summary();
            break;
    }
}



