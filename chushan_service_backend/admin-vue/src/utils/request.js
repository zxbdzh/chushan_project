import axios from 'axios'
import router from '@/router'
import { ElMessage } from 'element-plus' // 根据实际UI库调整
import { useUserStore } from '@/stores/user.js'

const userStore = useUserStore()

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  withCredentials: true, // 允许携带凭证
  timeout: 5000,
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 从userStore获取token
    if (userStore.token !== '') {
      config.headers = config.headers || {}
      config.headers['authorization'] = `${userStore.token}`
    }

    // 处理文件上传
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data'
    }

    config.timeout = 15000

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 500处理
    if (response && response.data.code === 500) {
      ElMessage.error(response.data.msg)
      return Promise.reject(new Error('请求错误'))
    }
    return response.data
  },
  (error) => {
    const { response } = error

    // 401处理
    if (response && response.status === 401) {
      // 检查是否是登录请求，避免在登录过程中清除token
      const isLoginRequest =
        error.config && error.config.url && error.config.url.includes('/user/login')

      // 如果不是登录请求，才清除token并跳转
      if (!isLoginRequest) {
        userStore.changeToken('')
        router.push('/login').catch(() => {})
        ElMessage.error('登录已过期，请重新登录')
      }
      return Promise.reject(new Error('授权已过期'))
    }

    // 统一错误处理
    const message = response?.data?.message || error.message
    ElMessage.error(message)
    return Promise.reject(error)
  },
)

export default service
