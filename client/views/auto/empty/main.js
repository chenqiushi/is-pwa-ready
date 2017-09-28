import {search2obj, obj2search} from 'utils';
export default async function () {
    const search = search2obj();
    let {step = 0} = search;
    step = parseInt(step, 10);
    step++;
    const hasSW = !!navigator.serviceWorker;
    if (hasSW) {
        await navigator.serviceWorker.register('/auto/empty-sw.js', {scope: '/auto/'});
    }
    localStorage.setItem('from', 'step0');
    location.search = obj2search(Object.assign(search, {step}));
}
