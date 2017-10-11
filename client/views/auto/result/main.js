import store from 'store';
import Raven from 'raven';
import {isNumeric, uuid} from 'utils';
import {featureKeys, info, testTips} from '../helper';
// import {info, testTips} from '../helper';
function genRGB(score) {
    score = isNumeric(score) ? score : 0;
    return [
        ~~(141 - 141 * score),
        ~~(49 + 101 * score),
        24
    ];
}

// noAdd 参数表示测试项是否加1， true 是不加
export default async function (noAdd) {
    info.timeoutTimer && clearTimeout(info.timeoutTimer);
    document.querySelector('tbody').innerHTML = '';
    let resultHTML = '';
    let fullScore = 0;
    let totalScore = 0;
    const result = {};
    for (let i = 0; i < featureKeys.length; i++) {
        const key = featureKeys[i];
        const scoreStr = await store.get('feature', key);
        const isNote = scoreStr && !isNumeric(scoreStr);
        const score = isNote ? scoreStr : parseFloat(scoreStr || 0);
        const rgb = isNote
            ? [0, 0, 0]
            : genRGB(score);
        fullScore = isNote ? fullScore : fullScore + 1;
        totalScore = isNote ? totalScore : totalScore + score;
        const li = `
        <tr style="color: rgb(${rgb.toString()})">
            <td class="key">${key}</td>
            <td class="${isNote ? 'note' : 'score'}">${isNote ? score : score * 100}</td>
        </tr>
        `;
        result[key] = score;
        resultHTML += li;
    }
    document.querySelector('.features tbody').innerHTML = resultHTML;
    const rank = totalScore / fullScore;
    const rgb = genRGB(rank);
    document.querySelector('.result').style.backgroundColor = `rgb(${rgb.toString()})`;
    document.querySelector('.total-score').innerHTML = ~~(rank * 100);
    let schedule = await store.get('info', 'schedule');
    schedule = parseFloat(schedule || 0);
    if (!noAdd) {
        schedule = ++schedule;
    }
    let showSchedule = (schedule / info.totalSchedule * 100) % 100;
    showSchedule = schedule && !showSchedule ? 100 : showSchedule;
    document.querySelector('.schedule span').innerHTML = ~~(showSchedule) + '%';
    await store.put('info', schedule, 'schedule');
    if (schedule !== info.totalSchedule) {
        // console.log('some error ?------')
        // console.log(schedule)
        // console.log(info.totalSchedule)
        // console.log('-----------')
        info.timeoutTimer = setTimeout(async () => {
            Raven.setUserContext({result});
            Raven.captureMessage('test-failed-' + uuid(), {
                level: 'warning'
            });
            document.querySelector('.schedule').innerHTML = testTips.fail;
        }, 15000);
    }
}
