import store from 'store'
import {uuid} from 'utils'
export default async function () {
  await store.clear('feature')
  await store.clear('info')
  await store.put('info', 0, 'schedule')
  let id = await store.get('uuid', 'id')
  if (!id) {
    await store.put('uuid', uuid(), 'id')
  }
  const hasSW = !!navigator.serviceWorker
  if(!hasSW) return
  const reg = await navigator.serviceWorker.getRegistration()
  if(reg) {
    await reg.unregitster && reg.unregitster()
  }
}
