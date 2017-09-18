import {featureKeys, infoKeys} from '../helper'
import {isNumeric, uuid} from 'utils'
import store from 'store'
import axios from 'axios'
export default async function () {
  const summary = {
    info: {},
    feature: {}
  }
  async function setSummary (kind, keys) {
    for(let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const score = await store.get(kind, key)
      if(isNumeric(score)) {
        summary[kind][key] = parseFloat(score)
      } else {
        try {
          summary[kind][key] = JSON.parse(score)
        } catch (error) {
          summary[kind][key] = score
        }
      }
    }
  }
  await setSummary('info', infoKeys)
  await setSummary('feature', featureKeys)
  const json = JSON.stringify(summary, null, 2)
  document.querySelector('.summary code').innerHTML = json

  document.querySelector('.summary').classList.add('show')

  // 发送统计
  let id = await store.get('uuid', 'id')
  if (!id) {
    id = uuid()
    await store.put('uuid', id, 'id')
  }
  axios({
    method: 'post',
    url: 'http://172.18.18.32:8849/ready/statistic',
    data: {
      id,
      data: summary
    }
  })

  return summary
}
