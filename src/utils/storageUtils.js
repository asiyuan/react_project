/**
 * Created by asy on 2019-1-15.
 */
import store from 'store'

const USER_KEY = 'user_key'

function setItem(name, value) {
  if (value && typeof value !== 'function') {
    store.set(name, value)
  } else {
    alert('不支持此类型数据的存储')
  }
}

function getItem(name) {
  return store.get(name) || ''
}

function removeItem(name) {
  store.remove(name)
}

export default {
  // save
  saveUser(value) {
    setItem(USER_KEY, value)
  },
  // get
  getUser() {
    return getItem(USER_KEY)
  },
  // remove
  removeUser() {
    removeItem(USER_KEY)
  }
}


