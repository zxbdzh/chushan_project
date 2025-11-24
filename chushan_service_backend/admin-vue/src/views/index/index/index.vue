<template>
  <div class="app-container" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
    <!-- 移动端遮罩层 -->
    <div
      class="mobile-overlay"
      v-if="isMobile && !isSidebarCollapsed"
      @click="toggleSidebar"
    ></div>

    <!-- 左侧侧栏 -->
    <Sidebar
      :menuItems="menuItems"
      :activeMenu="activeMenu"
      :collapsed="isSidebarCollapsed"
      :isVisible="!isSidebarCollapsed"
      @navigate="navigateTo"
    />

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 顶部 header -->
      <AppHeader
        :currentPageTitle="currentPageTitle"
        :isMobile="isMobile"
        :isSidebarCollapsed="isSidebarCollapsed"
        @toggle-sidebar="toggleSidebar"
      />

      <!-- 主体内容 - router-view -->
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWindowSize } from '@vueuse/core'
import Sidebar from '@/components/layout/Sidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import {
  Document,
  Calendar,
  User,
  House,
  Tickets,
  Location,
  ShoppingBag,
  CaretRight,
  VideoPlay,
  MapLocation,
  Present,
  HomeFilled,
  Clock
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const activeMenu = ref('')

const menuItems = [
  {
    title: '内容管理',
    iconComponent: Document,
    route: '/content',
    children: [
      { title: '动态管理', route: '/content/dynamics', iconComponent: VideoPlay },
      { title: '景点管理', route: '/content/attractions', iconComponent: MapLocation },
      { title: '特产管理', route: '/content/specialties', iconComponent: Present },
      { title: '停车管理', route: '/content/parking', iconComponent: Location },
      { title: '攻略管理', route: '/content/guides', iconComponent: Document },
    ]
  },
  { title: '预约管理', iconComponent: Tickets, route: '/appointments' },
  {
    title: '房间管理',
    iconComponent: House,
    route: '/rooms',
    children: [
      { title: '房间管理', route: '/rooms', iconComponent: HomeFilled },
      { title: '房间预约管理', route: '/room-reservations', iconComponent: Clock },
    ]
  },
]

const currentPageTitle = computed(() => {
  let title = '仪表盘'

  for (const item of menuItems) {
    if (item.route === activeMenu.value) {
      title = item.title
      break
    }

    if (item.children) {
      for (const child of item.children) {
        if (child.route === activeMenu.value) {
          title = `${item.title} - ${child.title}`
          break
        }
      }
    }
  }

  return title
})

// 添加移动端相关的状态
const { width } = useWindowSize()
const isMobile = computed(() => width.value < 768)
const isSidebarCollapsed = ref(false)

// 更新 toggleSidebar 函数
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

// 监听移动端状态变化
watch(isMobile, (newValue) => {
  if (newValue) {
    isSidebarCollapsed.value = true
  }
})

// 监听路由变化，在移动端时自动收起侧边栏
watch(route, () => {
  if (isMobile.value) {
    isSidebarCollapsed.value = true
  }
})

const navigateTo = (routePath) => {
  activeMenu.value = routePath
  router.push(routePath)
}

watch(
  () => route.path,
  (newPath) => {
    const isChildRoute = menuItems.some(
      (item) => item.children && item.children.some((child) => child.route === newPath),
    )

    if (isChildRoute) {
      activeMenu.value = newPath
    } else {
      const parentRoute = menuItems.find(
        (item) => newPath.startsWith(item.route) && item.route !== '/',
      )
      activeMenu.value = parentRoute ? parentRoute.route : newPath
    }
  },
  { immediate: true },
)

onMounted(() => { })
</script>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-background);
  color: var(--color-text);
  transition: all 0.3s;
  position: relative;
}

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
  display: none;
}

/* 移动端样式 */
@media (max-width: 768px) {
  .mobile-overlay {
    display: block;
  }

  .app-container {
    overflow-x: hidden;
  }

  .app-container.sidebar-collapsed .mobile-overlay {
    display: none;
  }

  .main-content {
    width: 100%;
    margin-left: 0;
  }
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0; /* 防止内容溢出 */
}

.content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: var(--color-background-mute);
}

/* 适配小屏幕的内容区域padding */
@media (max-width: 768px) {
  .content {
    padding: 10px;
  }
}
</style>
