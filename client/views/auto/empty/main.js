import {sleep} from 'utils';
export default async function () {
    console.log('empty test');
    // const search = search2obj();
    // let {step = 0} = search;
    // step = parseInt(step, 10);
    // step++;
    const hasSW = !!navigator.serviceWorker;
    if (hasSW) {
        await navigator.serviceWorker.register('/auto/empty-sw.js', {scope: '/auto/'});
        await sleep(5000);
    }
    // localStorage.setItem('from', 'step0');
    // location.search = obj2search(Object.assign(search, {step}));
}
