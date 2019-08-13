import store from 'store'
function getCookie (name, defaultValue) {
  let lang = store.get('lang')
  if (lang === null || lang === undefined) {
    let arr
    let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    if (arr = document.cookie.match(reg)) {
      return unescape(arr[2])
    } else {
      return defaultValue
    }
  } else {
    return lang
  }
}

export {
  getCookie
}
