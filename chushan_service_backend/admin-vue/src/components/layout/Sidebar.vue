<template>
  <aside class="sidebar" :class="{ show: isVisible }">
    <!-- Logo 区域 -->
    <div class="logo-area">
      <img src="@/assets/logo.png" alt="Logo" class="logo-icon" />
      <span class="system-title">锄山服务后台管理系统</span>
    </div>

    <!-- 导航菜单 -->
    <nav class="menu-container">
      <ul class="menu-list">
        <li v-for="(item, index) in menuItems" :key="index" class="menu-item" :class="{
          active: isMenuActive(item),
          'has-submenu': item.children,
        }" @mouseenter="handleMenuHover(index)" @mouseleave="clearHoverState">
          <div class="menu-content" @click="handleMenuClick(item)">
            <el-icon class="menu-icon">
              <component :is="item.iconComponent" />
            </el-icon>
            <span class="menu-text">{{ item.title }}</span>
            <el-icon v-if="item.children" class="arrow-icon">
              <arrow-right />
            </el-icon>
          </div>

          <!-- 子菜单 -->
          <transition name="submenu-slide">
            <ul v-if="item.children && hoverIndex === index" class="submenu">
              <li v-for="(child, childIndex) in item.children" :key="childIndex" class="submenu-item"
                :class="{ active: $route.path === child.route }" @click.stop="navigateTo(child.route)">
                <el-icon v-if="child.iconComponent" class="submenu-icon">
                  <component :is="child.iconComponent" />
                </el-icon>
                <span class="submenu-text">{{ child.title }}</span>
              </li>
            </ul>
          </transition>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Monitor, ArrowRight } from '@element-plus/icons-vue'

interface MenuItem {
  title: string
  iconComponent: any
  route?: string
  children?: SubMenuItem[]
}

interface SubMenuItem {
  title: string
  route: string
  iconComponent?: any
}

const props = defineProps({
  menuItems: {
    type: Array as () => MenuItem[],
    default: () => [
      {
        title: '仪表盘',
        iconComponent: Monitor,
        route: '/dashboard',
      },
    ],
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
  collapsed: {
    type: Boolean,
    default: false,
  },
})

const route = useRoute()
const router = useRouter()
const hoverIndex = ref(-1)

// 菜单激活状态判断
const isMenuActive = (item: MenuItem) => {
  return (
    item.route === route.path ||
    (item.children?.some((child) => child.route === route.path) ?? false)
  )
}

// 菜单悬浮处理
const handleMenuHover = (index: number) => {
  hoverIndex.value = index
}

// 清除悬浮状态
const clearHoverState = () => {
  hoverIndex.value = -1
}

// 菜单点击处理
const handleMenuClick = (item: MenuItem) => {
  // 如果有子菜单，则展开/收起子菜单，不跳转
  if (item.children && item.children.length > 0) {
    // 切换悬浮状态来显示/隐藏子菜单
    const currentIndex = props.menuItems.findIndex(menu => menu === item)
    if (hoverIndex.value === currentIndex) {
      clearHoverState()
    } else {
      hoverIndex.value = currentIndex
    }
  } else if (item.route) {
    // 没有子菜单才跳转
    router.push(item.route)
    emit('navigate', item.route)
  }
}

// 子菜单导航
const navigateTo = (path: string) => {
  router.push(path)
  clearHoverState()
  emit('navigate', path)
}

// 定义事件
const emit = defineEmits(['navigate', 'close'])
</script>

<style scoped lang="scss">
.sidebar {
  width: 240px;
  height: 100vh;
  background: var(--color-background);
  border-right: 1px solid var(--color-border);
  transition: width 0.3s;
  position: relative;
  z-index: 1000;
}

.logo-area {
  display: flex;
  align-items: center;
  padding: 18px 24px;
  border-bottom: 1px solid var(--color-border);

  .logo-icon {
    width: 32px;
    height: 32px;
    margin-right: 12px;
    transition: margin-right 0.3s;
  }

  .system-title {
    color: var(--color-text);
    font-size: 18px;
    font-weight: 600;
    transition: opacity 0.3s;
  }
}

.menu-container {
  padding: 16px 0;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  position: relative;
  margin: 4px 12px;

  &.active {
    .menu-content {
      background: var(--color-background-soft);
      border-radius: 6px;
    }
  }

  .menu-content {
    display: flex;
    align-items: center;
    padding: 10px 16px;
    color: var(--color-text);
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: var(--color-background-soft);
      border-radius: 6px;
    }
  }

  .menu-icon {
    font-size: 18px;
    margin-right: 12px;
    transition: margin-right 0.3s;
  }

  .menu-text {
    font-size: 14px;
    flex-grow: 1;
    transition: opacity 0.3s;
  }

  .arrow-icon {
    font-size: 12px;
    margin-left: 8px;
    transition: transform 0.2s;
  }
}

.submenu {
  list-style: none;
  padding: 8px 0;
  margin: 0;
  background: var(--color-background-mute);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  &-item {
    display: flex;
    align-items: center;
    padding: 8px 24px;
    color: var(--color-text);
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background: var(--color-background-soft);
    }

    &.active {
      color: var(--color-heading);
    }
  }

  &-icon {
    font-size: 14px;
    margin-right: 8px;
    color: var(--color-text-2);
  }

  &-text {
    font-size: 13px;
  }
}

.submenu-slide-enter-active {
  transition: all 0.2s ease-out;
}

.submenu-slide-leave-active {
  transition: all 0.15s ease-in;
}

.submenu-slide-enter-from,
.submenu-slide-leave-to {
  opacity: 0;
  transform: translateX(8px);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 280px;
    height: 100vh;
    transform: translateX(-100%);
    transition: transform 0.3s ease-in-out;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
    z-index: 1001;
  }

  .sidebar.show {
    transform: translateX(0);
  }

  .logo-area {
    padding: 20px 24px;

    .system-title {
      font-size: 16px;
    }
  }

  .menu-item {
    margin: 6px 16px;

    .menu-content {
      padding: 14px 20px;
      border-radius: 8px;
    }

    .menu-icon {
      font-size: 20px;
      margin-right: 16px;
    }

    .menu-text {
      font-size: 15px;
    }
  }

  .submenu {
    margin: 8px 16px;

    &-item {
      padding: 12px 28px;
    }

    &-icon {
      font-size: 16px;
      margin-right: 10px;
    }

    &-text {
      font-size: 14px;
    }
  }
}

@media (max-width: 480px) {
  .sidebar {
    width: 100vw;
  }

  .logo-area {
    padding: 16px 20px;

    .logo-icon {
      width: 28px;
      height: 28px;
    }

    .system-title {
      font-size: 15px;
    }
  }

  .menu-item {
    margin: 4px 12px;

    .menu-content {
      padding: 16px 18px;
    }
  }
}
</style>
