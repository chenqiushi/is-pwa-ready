import {sleep} from 'utils';
export default async function () {
    console.log('-- empty test --');

    const step = localStorage.getItem('step');

    // if (step === 'empty') {
    //     localStorage.setItem('step', '');
    //     // await sleep(5000);
    // }
    // else {
    //     localStorage.setItem('step', 'empty');
    //     await sleep(3000);
    //     window.location.reload();
    //     return await sleep(5000);
    // }
    // const search = search2obj();
    // let {step = 0} = search;
    // step = parseInt(step, 10);
    // step++;
    const hasSW = !!navigator.serviceWorker;
    if (hasSW) {
        try {
            console.log('start empty');
            await navigator.serviceWorker.register('/auto/empty-sw.js', {scope: '/auto/'});
            console.log('mid empty');
            await sleep(5000);
            console.log('end empty');
        }
        catch (e) {
            console.log('err empty');
            console.log(e);
        }
    }
    // localStorage.setItem('from', 'step0');
    // location.search = obj2search(Object.assign(search, {step}));
}
