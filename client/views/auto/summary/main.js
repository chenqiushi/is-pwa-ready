import {featureKeys, infoKeys} from '../helper';
import {isNumeric, uuid} from 'utils';
import store from 'store';
import axios from 'axios';
export default async function () {
    const summary = {
        info: {},
        feature: {}
    };
    async function setSummary(kind, keys) {
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const score = await store.get(kind, key);
            if (isNumeric(score)) {
                summary[kind][key] = parseFloat(score);
            }
            else {
                try {
                    summary[kind][key] = JSON.parse(score);
                }
                catch (error) {
                    summary[kind][key] = score;
                }
            }
        }
    }
    await setSummary('info', infoKeys);
    await setSummary('feature', featureKeys);
    const json = JSON.stringify(summary, null, 2);
    document.querySelector('.summary code').innerHTML = json;

    document.querySelector('.summary').classList.add('show');

    let sendDataBtn = document.querySelector('.send-data');
    sendDataBtn.classList.remove('hide');

    sendDataBtn.addEventListener('click', async function (e) {
        debugger
        let sendData = confirm('send data to the database ?');

        if (sendData) {
            // 发送统计
            let id = await store.get('uuid', 'id');
            if (!id) {
                id = uuid();
                await store.put('uuid', id, 'id');
            }

            let res = await axios({
                method: 'post',
                url: 'https://lavas.baidu.com/api/ready/statistic',
                data: {
                    id,
                    info: summary.info,
                    feature: summary.feature
                }
            });

            let sendTip = document.querySelector('.send-data-tip');
            if (res && res.data && res.data.status === 0) {
                sendTip.innerHTML = 'Success!';
                sendTip.classList.remove('hide-tip');
                sendTip.classList.add('show-tip');
                setTimeout(function () {
                    sendTip.classList.remove('show-tip');
                    sendTip.classList.add('hide-tip');
                }, 3000);
            }
            else {
                sendTip.innerHTML = 'Failed!';
                sendTip.classList.remove('hide-tip');
                sendTip.classList.add('show-tip');
                setTimeout(function () {
                    sendTip.classList.remove('show-tip');
                    sendTip.classList.add('hide-tip');
                }, 3000);
            }
        }
    });

    return summary;
}



