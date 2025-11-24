<template>
  <header class="header">
    <div class="header-left">
      <!-- 移动端菜单按钮 -->
      <button
        v-if="isMobile"
        class="mobile-menu-btn"
        @click="$emit('toggle-sidebar')"
        :class="{ active: !isSidebarCollapsed }"
      >
        <i class="icon-menu"></i>
      </button>

      <div class="breadcrumb">
        <span>{{ currentPageTitle }}</span>
      </div>
    </div>

    <div class="header-right">

      <!-- 主题切换按钮 -->
      <div class="theme-toggle" @click="showThemeMenu = !showThemeMenu">
        <i :class="{
          'icon-sun': !themeStore.isDark && themeStore.themeMode !== 'auto',
          'icon-moon': themeStore.isDark && themeStore.themeMode !== 'auto',
          'icon-monitor': themeStore.themeMode === 'auto'
        }"></i>

        <!-- 主题模式下拉菜单 -->
        <div class="dropdown-menu theme-dropdown" v-if="showThemeMenu">
          <div class="dropdown-items">
            <div class="dropdown-item" @click="setThemeMode('light')">
              <i class="icon-sun"></i>
              <span>亮色模式</span>
            </div>
            <div class="dropdown-item" @click="setThemeMode('dark')">
              <i class="icon-moon"></i>
              <span>暗色模式</span>
            </div>
            <div class="dropdown-item" @click="setThemeMode('auto')">
              <i class="icon-monitor"></i>
              <span>跟随系统</span>
            </div>
          </div>
        </div>
      </div>

      <div class="user-profile" @click="showUserMenu = !showUserMenu">
        <img :src="userStore.avatar" alt="用户头像" class="avatar" />
        <span class="username">管理员</span>
        <i class="icon-chevron-down"></i>

        <!-- 用户下拉菜单 -->
        <div class="dropdown-menu" v-if="showUserMenu">
          <div class="dropdown-items">
            <div class="dropdown-divider"></div>
            <div class="dropdown-item" @click="logout">
              <i class="icon-log-out"></i>
              <span>退出登录</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.js'
import { useThemeStore } from '@/stores/theme.ts'
import request from '@/utils/request.js'

const userStore = useUserStore()
const themeStore = useThemeStore()
const router = useRouter()

// 状态管理
const showUserMenu = ref(false)
const showThemeMenu = ref(false)

// Props 定义
defineProps({
  currentPageTitle: {
    type: String,
    default: '页面',
  },
  isMobile: {
    type: Boolean,
    default: false,
  },
  isSidebarCollapsed: {
    type: Boolean,
    default: false,
  },
})

// Emits 定义
defineEmits(['toggle-sidebar'])

// 初始化
onMounted(() => {
  if (userStore.avatar === '') setAvatar()
  themeStore.initTheme()
})

// 设置头像
const setAvatar = async () => {
  try {
    const res = await request({
      url: '/user/avatar',
      method: 'GET',
    })
    userStore.avatar = res.data
  } catch (error) {
    console.error('获取头像失败:', error)
  }
}

// 设置主题模式
const setThemeMode = (mode) => {
  themeStore.setThemeMode(mode)
  showThemeMenu.value = false
}

// 退出登录
const logout = () => {
  userStore.changeToken('')
  userStore.avatar = ''
  router.push('/login')
}
</script>

<style scoped>
/* 图标字体 */
.icon-menu:before {
  content: '☰';
}
.icon-chevron-down:before {
  content: '▼';
}
.icon-log-out:before {
  content: '🚪';
}
.icon-sun:before {
  content: '☀️';
}
.icon-moon:before {
  content: '🌙';
}
.icon-monitor:before {
  content: '🖥️';
}

/* 顶部 header */
.header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background-color: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
}

/* 移动端菜单按钮 */
.mobile-menu-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  margin-right: 15px;
  border-radius: 4px;
  color: var(--color-text);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.mobile-menu-btn:hover {
  background-color: var(--color-background-mute);
}

.mobile-menu-btn.active {
  background-color: var(--color-background-soft);
  color: var(--color-heading);
}

.mobile-menu-btn i {
  font-size: 1.2rem;
}

.breadcrumb {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--color-heading);
}



/* 主题切换按钮 */
.theme-toggle {
  margin-right: 20px;
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--color-background-mute);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
  position: relative;
}

.theme-toggle:hover {
  background-color: var(--color-background-soft);
}

.theme-toggle i {
  font-size: 1.2rem;
}

.theme-dropdown {
  width: 150px;
  right: -10px;
  top: 45px;
}

.theme-dropdown .dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
}



.user-profile {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
}

.username {
  margin-right: 5px;
  font-weight: 500;
}

/* 下拉菜单 */
.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  width: 280px;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
  margin-top: 10px;
  overflow: hidden;
}

.dropdown-header {
  padding: 12px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  font-weight: 500;
}

.dropdown-items {
  max-height: 300px;
  overflow-y: auto;
}

.dropdown-item {
  padding: 12px 15px;
  display: flex;
  align-items: center;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: var(--color-background-mute);
}

.dropdown-item i {
  margin-right: 10px;
  font-size: 1.2rem;
}

.dropdown-divider {
  height: 1px;
  background-color: var(--color-border);
  margin: 5px 0;
}

.dropdown-footer {
  padding: 12px 15px;
  text-align: center;
  border-top: 1px solid var(--color-border);
}

.dropdown-link {
  color: var(--color-heading-card);
  cursor: pointer;
}

.dropdown-link:hover {
  text-decoration: underline;
}



/* 响应式设计 */
@media (max-width: 768px) {
  .header {
    padding: 0 15px;
  }

  .header-left {
    flex: 1;
    min-width: 0;
  }

  .breadcrumb {
    font-size: 1rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .theme-toggle {
    margin-right: 15px;
    width: 32px;
    height: 32px;
  }

  .username {
    display: none;
  }

  .dropdown-menu {
    width: 250px;
    right: -10px;
  }

  .avatar {
    width: 32px;
    height: 32px;
    margin-right: 5px;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 0 10px;
  }

  .theme-toggle {
    margin-right: 10px;
  }

  .dropdown-menu {
    width: 200px;
    right: -5px;
  }
}
</style>
