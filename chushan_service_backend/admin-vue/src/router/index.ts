import { createRouter, createWebHistory } from 'vue-router'
import { useThemeStore } from '@/stores/theme.ts'
import { useUserStore } from '@/stores/user.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/views/index/index/index.vue'),
      children: [
        {
          path: '/content',
          redirect: '/content/dynamics',
        },
        {
          path: '/content/dynamics',
          name: 'dynamics',
          component: () => import('@/views/content/dynamics/index.vue'),
        },
        {
          path: '/content/attractions',
          name: 'attractions',
          component: () => import('@/views/content/attractions/index.vue'),
        },
        {
          path: '/content/specialties',
          name: 'specialties',
          component: () => import('@/views/content/specialties/index.vue'),
        },
        {
          path: '/content/parking',
          name: 'parking',
          component: () => import('@/views/content/parking/index.vue'),
        },
        {
          path: '/content/guides',
          name: 'guides',
          component: () => import('@/views/content/guides/index.vue'),
        },
        {
          path: '/appointments',
          name: 'appointments',
          component: () => import('@/views/appointments/index.vue'),
        },
        {
          path: '/rooms',
          name: 'rooms',
          component: () => import('@/views/rooms/index.vue'),
        },
        {
          path: '/room-reservations',
          name: 'room-reservations',
          component: () => import('@/views/room-reservations/index.vue'),
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/login/login.vue'),
    },
  ],
})

// 全局前置守卫，在每次路由切换时初始化主题和检查登录状态
router.beforeEach((to, from, next) => {
  const themeStore = useThemeStore()
  const userStore = useUserStore()

  // 初始化主题
  themeStore.initTheme()

  // 检查登录状态
  const isLoggedIn = userStore.token && userStore.token.trim() !== ''
  const isLoginPage = to.path === '/login'

  if (isLoginPage) {
    // 如果已登录，重定向到首页
    if (isLoggedIn) {
      next('/')
    } else {
      next()
    }
  } else {
    // 如果未登录，重定向到登录页
    if (!isLoggedIn) {
      next('/login')
    } else {
      next()
    }
  }
})

export default router
