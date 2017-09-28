import store from 'store';
export default async function () {
    await Promise.all([
        store.clear('feature'),
        store.clear('info')
    ]);
    // await store.clear('feature');
    // await store.clear('info');
    await store.put('info', 0, 'schedule');

    if (!navigator.serviceWorker) {
        return;
    }

    const reg = await navigator.serviceWorker.getRegistration();

    if (reg && reg.unregitster) {
        await reg.unregitster();
    }
}
