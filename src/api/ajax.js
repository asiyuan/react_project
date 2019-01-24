/**
 * Created by asy on 2019-1-15.
 */

import axios from 'axios'
import {message} from 'antd'

export default function ajax(url, data = {}, method = 'GET') {

  return new Promise((resolve, reject) => {
    let promise
    if (method === 'GET') {
      promise = axios.get(url, {params: data})
    } else {
      promise = axios.post(url, data)
    }

    promise
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        console.log(url, err)
        message.error('请求出错了')
      })
  })
}





















