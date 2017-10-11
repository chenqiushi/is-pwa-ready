import './main.css';

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
// import {sleep} from 'utils';
// import {search2obj, obj2search, uuid, isNumeric} from 'utils';
// import store from 'store';
// import axios from 'axios';
// import './main.css';
// import 'vconsole';
import {info} from './helper';
// import 'views/common/raven';

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

// const step = localStorage.getItem('step') || 'init';
// const {step = '0'} = search2obj();

main();

async function main() {
    console.log('main');
    // console.log(navigator.serviceWorker.controller);
    // console.log('in main...');
    // let sw = navigator.serviceWorker;
    // navigator.serviceWorker.oncontrollerchange = function (event) {
    //     console.log(Date.now() + ': controllerchange 1');
    //     console.log(event);
    // };

    // sw.addEventListener('oncontrollerchange', function (event) {
    //     console.log(Date.now() + ': controllerchange 2');
    //     console.log(event);
    // });

    // navigator.serviceWorker.addEventListener('controllerchange', function (event) {
    //     console.log(Date.now() + ': controllerchange 3');
    //     console.log(event);
    // });

    const step = localStorage.getItem('step') || 'init';
    /* eslint-disable no-fallthrough */
    switch (step) {
        case 'init':
            await init();
            await env();
            await result();

        case 'global':
            await globalTest();
            await result();

        case 'empty':
            await empty();
            await result();

        case 'lifecycle':
            await result(true);
            await lifecycleTest();
            await result();

        case 'postmessage':
            await postmessageTest();
            await result();

        case 'sync':
            await syncTest();
            await result();

        case 'cache':
            await cache();
            await result();

        case 'push':
            await push();
            await result();

        default:
            await summary();
    }

    // await init();
    // await env();
    // await result();
    // await globalTest();
    // await result();
    // await empty();
    // await result();

    // await sleep(2000);

    // await lifecycleTest();
    // await result();
    // await postmessageTest();
    // await result();
    // await syncTest();
    // await result();
    // await cache();
    // await result();
    // await push();
    // await result();
    // await summary();

    // 如果是step=1刷新，则重定向到step=0，重新走测试流程
    // if (step === '1' && localStorage.getItem('from') !== 'step0') {
    //     const search = search2obj();
    //     location.search = obj2search(Object.assign(search, {step: '0'}));
    // }

    // switch (step) {
    //     case '0':
    //         localStorage.setItem('from', 'step0');
    //         await init();
    //         await env();
    //         await result();
    //         await globalTest();
    //         await result();
    //         await empty();
    //         return;
    //     case '1':
    //         await result();
    //         await lifecycleTest();
    //         await result();
    //         await postmessageTest();
    //         await result();
    //         await syncTest();
    //         await result();
    //         await cache();
    //         await result();
    //         await push();
    //         await result();
    //         await summary();
    //         break;
    // }
}
