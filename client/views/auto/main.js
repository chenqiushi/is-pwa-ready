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
import 'vconsole';
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

info.totalSchedule = 8;
// const uaInfo = {
//     info: {}
// };
const {step = '0', fr = ''} = search2obj();

(async function main() {
    // 生成 uuid
    let id = await store.get('uuid', 'id');

    if (!id) {
        id = uuid();
        store.put('uuid', id, 'id');
    }

    // 如若是manifest的测试,直接返回了
    if (fr === 'manifesticon') {
        const ua = await store.get('info', 'ua');

        if (!ua) {
            await env();
        }

        let uaInfo = await setUa('info', infoKeys);

        axios({
            method: 'post',
            url: 'http://127.0.0.1:8849/ready/statistic',
            data: {
                id,
                info: uaInfo.info,
                manifest: {
                    addToScreen: 1
                }
            }
        });

        return;
    }

    // 如果是step=1刷新，则重定向到step=0，重新走测试流程
    if (step === '1' && localStorage.getItem('from') !== 'step0') {
        const search = search2obj();
        location.search = obj2search(Object.assign(search, {step: '0'}));
    }

    switch (step) {
        case '0':
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
})();

async function setUa(kind, keys) {
    let uaInfo = {
        [kind]: undefined
    };

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const score = await store.get(kind, key);
        if (isNumeric(score)) {
            uaInfo[kind][key] = parseFloat(score);
        }
        else {
            try {
                uaInfo[kind][key] = JSON.parse(score);
            }
            catch (error) {
                uaInfo[kind][key] = score;
            }
        }
    }

    return uaInfo;
}
