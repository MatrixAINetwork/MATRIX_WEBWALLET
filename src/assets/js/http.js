import axios from 'axios'
import router from '../../router/index'
/**
 * http配置
 */
// const baseUrl = 'https://testnet1.matrix.io/api/'
const baseUrl = 'https://wallet.matrix.io/api/'
// const baseUrl = 'http://localhost:8999/api/'

const instance = axios.create({
  timeout: 1000000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// http request 拦截器
instance.interceptors.request.use(
  config => {
    if (config.url.indexOf('http') < 0) {
      config.url = baseUrl + config.url
    }
    // // 若是有做鉴权token , 就给头部带上token
    // if (sessionStorage.token && config.url.indexOf('login') < 0) {
    //   config.headers.Authorization = sessionStorage.token
    // }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// http response 拦截器
instance.interceptors.response.use(
  response => {
    return response
  },
  error => {
    // 当响应异常时做一些处理
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 返回 401 清除token信息并跳转到登录页面
          sessionStorage.removeItem('token')
          router.replace({
            path: 'login'
          })
      }
    }
    return Promise.reject(error)
  }
)

// 对axios的实例重新封装成一个plugin ,方便 Vue.use(xxxx)
export default {
  install: function (Vue, Option) {
    Object.defineProperty(Vue.prototype, '$http', {
      value: instance
    })
  }
}

export {
  baseUrl
}
