<script setup>
import { ref } from 'vue'
import request from '@/utils/request'
import { useUserStore } from '@/stores/user.ts'
import { ElMessage } from 'element-plus'
import router from '@/router/index.js'

const userStore = useUserStore()

const form = ref({
  username: '',
  password: '',
})
const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  if (!/^[a-zA-Z0-9]{4,16}$/.test(form.value.username)) {
    errorMessage.value = '用户名需4-16位字母数字'
    return
  }
  if (!/^.{6,18}$/.test(form.value.password)) {
    errorMessage.value = '密码需6-18位任意字符'
    return
  }
  loading.value = true
  await login()
}

const login = async () => {
  try {
    const res = await request({
      url: '/user/login',
      method: 'post',
      headers: {
        // 添加请求头配置
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: {
        username: form.value.username,
        password: form.value.password,
      },
    })

    userStore.changeToken(res.data)
    if (userStore.token !== '') {
      ElMessage.success('登录成功')
      loading.value = false
      // 登录成功后强制跳转到首页并刷新
      await router.push('/')
      // 强制刷新页面以确保状态更新
      window.location.reload()
    }
  } catch (err) {
    loading.value = false
    errorMessage.value = '登录失败，请检查用户名和密码'
  }
}
</script>

<template>
  <div class="login-container">
    <!-- 动态背景气泡 -->
    <div class="bg-bubbles">
      <div v-for="i in 10" :key="i" class="bubble"></div>
    </div>

    <!-- 登录卡片 -->
    <div class="login-card">
      <h1 class="title">ADMIN<span>PANEL</span></h1>

      <el-form @submit.prevent="handleLogin">
        <div class="input-group">
          <input
            v-model="form.username"
            type="text"
            required
            placeholder=" "
            class="modern-input"
          />
          <label>用户名</label>
        </div>

        <div class="input-group">
          <input
            v-model="form.password"
            type="password"
            required
            placeholder=" "
            class="modern-input"
          />
          <label>密码</label>
        </div>

        <button :disabled="loading" class="login-btn">
          <span v-if="!loading">登 录</span>
          <span v-else class="loading"></span>
        </button>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:math';

.login-container {
  min-height: 100vh;
  background: var(--login-gradient);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
}

.bg-bubbles {
  position: absolute;
  width: 100%;
  height: 100%;

  .bubble {
    position: absolute;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    animation: float 15s infinite;

    @for $i from 1 through 10 {
      &:nth-child(#{$i}) {
        $size: math.random(50) + 20px;
        left: math.random(100) * 1%;
        top: math.random(100) * 1%;
        width: $size;
        height: $size;
        animation-delay: -$i * 2s;
      }
    }
  }
}

.login-card {
  background: var(--color-background-soft);
  box-shadow: 0 15px 35px var(--color-border-hover);
  border: 1px solid var(--color-border);
  padding: 2.5rem 3rem;
  border-radius: 20px;
  transform: translateY(0);
  transition: transform 0.3s;
  width: 380px;
  z-index: 1;

  .modern-input {
    color: var(--color-text);
  }

  &:hover {
    transform: translateY(-5px);
  }
}

.title {
  color: var(--color-heading-card);
  font-size: 2.2rem;
  text-align: center;
  margin-bottom: 2rem;

  span {
    color: var(--color-text);
    margin-left: 0.5rem;
  }
}

.input-group {
  position: relative;
  margin-bottom: 1.8rem;
  border-radius: 8px;
  border-color: var(--color-border);

  // 新增边框容器
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    transition: all 0.3s;
  }

  .modern-input {
    width: 100%;
    padding: 1rem;
    border: none; // 移除原有边框
    background: transparent;
    font-size: 1rem;
    position: relative;
    z-index: 1;

    &:focus,
    &:not(:placeholder-shown) {
      & + label {
        transform: translateY(-130%) scale(0.85);
        color: #3498db;
      }

      & ~ .input-group::before {
        border-color: #3498db;
      }
    }
  }

  label {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
    pointer-events: none;
    transition: all 0.3s;
    z-index: 2;
    padding: 0 0.3rem;
    background: transparent;
  }
}

.login-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(45deg, #3498db, #8e44ad);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: var(--color-border-hover);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }

  .loading {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite;
  }
}

.error-message {
  color: #e74c3c;
  margin-top: 1rem;
  text-align: center;
  animation: shake 0.5s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-20px) translateX(10px);
  }
  50% {
    transform: translateY(10px) translateX(-10px);
  }
  75% {
    transform: translateY(-10px) translateX(20px);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  50% {
    transform: translateX(10px);
  }
  75% {
    transform: translateX(-5px);
  }
}
</style>
