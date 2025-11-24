<template>
  <view class="container">
    <!-- 服务标题 -->
    <view class="header">
      <text class="title">{{ serviceData.title }}</text>
    </view>

    <!-- 服务内容区域 -->
    <view class="content-section">
      <!-- 动态展示不同服务类型的内容 -->
      <template v-if="type === 'bus'">
        <bus-info :data="serviceData" />
      </template>

      <template v-if="type === 'parking'">
        <parking-info :data="serviceData" />
      </template>

      <template v-if="type === 'weather'">
        <weather-forecast :data="serviceData" />
      </template>

      <!-- 其他服务类型模板 -->
    </view>

    <!-- 操作按钮 -->
    <view class="action-bar">
      <button class="action-btn" @tap="handleAction">{{ actionText }}</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import busInfo from '../../components/bus-info/bus-info.vue'
import parkingInfo from '../../components/parking-info/parking-info.vue'
import weatherForecast from '../../components/weather-forecast/weather-forecast.vue'
import request from '../../utils/request'

const props = defineProps({
  type: {
    type: String,
    required: true
  }
})

const serviceData = ref(null)
const actionText = ref('立即操作')

onMounted(async () => {
  await loadServiceData()
})

const loadServiceData = async () => {
  // try {
  //   const res = await request({
  //     url: `/service/${props.type}`,
  //     method: 'GET'
  //   })
  //   serviceData.value = res.data
  //   setActionText()
  // } catch (error) {
  //   console.error('获取服务数据失败:', error)
  // }
  setActionText()
}

const setActionText = () => {
  const actions = {
    bus: '查看实时位置',
    parking: '立即预约',
    weather: '刷新预报',
    toilet: '导航前往',
    agency: '联系旅行社',
    guide: '预约导游'
  }
  actionText.value = actions[props.type] || '立即操作'
}

const handleAction = () => {
  // 根据不同类型执行不同操作
  switch (props.type) {
    case 'parking':
      uni.navigateTo({
        url: '/pages/parking/parking'
      })
      break
    case 'guide':
      uni.makePhoneCall({
        phoneNumber: serviceData.value.contact
      })
      break
    // 其他类型处理...
  }
}
</script>

<style scoped>
.container {
  padding: 30rpx;
  min-height: 100vh;
  background-color: #ffffff;
}

.header {
  margin-bottom: 40rpx;
}

.title {
  font-size: 44rpx;
  font-weight: bold;
  color: #333;
}

.content-section {
  margin-bottom: 60rpx;
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx;
  background-color: #fff;
  box-shadow: 0 -4rpx 12rpx rgba(0,0,0,0.1);
}

.action-btn {
  background-color: #007AFF;
  color: white;
  border-radius: 50rpx;
  height: 80rpx;
  line-height: 80rpx;
}
</style>