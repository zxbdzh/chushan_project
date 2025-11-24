<template>
  <view class="container">
    <view class="header-image">
      <swiper class="swiper" circular autoplay interval="4000" duration="500" indicator-dots
        indicator-color="rgba(255, 255, 255, 0.6)" indicator-active-color="#FFFFFF">
        <swiper-item v-for="(item, index) in carouselImages" :key="index">
          <image :src="item.image" mode="aspectFill"></image>
        </swiper-item>
      </swiper>
    </view>

    <!-- 游玩保障服务 -->
    <view class="service-section">
      <text class="section-title">游玩保障服务</text>
      <view class="guarantee-grid">
        <view v-for="(item, index) in guaranteeServices" :key="index" class="service-card"
          :style="{ backgroundColor: item.color }" @tap="handleService(item)">
          <view class="card-content">
            <view class="card-text">
              <text class="card-title">{{ item.title }}</text>
              <text class="card-subtitle">{{ item.subtitle }}</text>
            </view>
            <text class="iconfont" :class="item.icon"></text>
          </view>
        </view>
      </view>
    </view>

    <!-- 旅游公共服务 -->
    <view class="service-section">
      <text class="section-title">旅游公共服务</text>
      <view class="public-grid">
        <view v-for="(item, index) in publicServices" :key="index" class="service-card"
          :style="{ backgroundColor: item.color }" @tap="handleService(item)">
          <view class="card-content">
            <view class="card-text">
              <text class="card-title">{{ item.title }}</text>
              <text class="card-subtitle">{{ item.subtitle }}</text>
            </view>
            <text class="iconfont" :class="item.icon"></text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  onLoad() {
    uni.setNavigationBarTitle({
      title: '服务'
    })
  }
}
</script>

<script setup>
import { ref, onMounted } from 'vue'
import request from '../../utils/request'

const carouselImages = ref(null)

const guaranteeServices = ref([
  {
    title: '旅游咨询',
    subtitle: '12301',
    icon: 'icon-phone',
    color: '#00BCD4',
    type: 'consultation'
  },
  {
    title: '投诉求助',
    subtitle: '投诉有门 实时高效',
    icon: 'icon-edit',
    color: '#9C27B0',
    type: 'complaint'
  }
])

const publicServices = ref([
  // {
  //   title: '公交信息',
  //   subtitle: '智慧公交 智慧旅游',
  //   icon: 'icon-bus',
  //   color: '#FF5252',
  //   type: 'bus'
  // },
  {
    title: '停车场',
    subtitle: '合理分配 高质高效',
    icon: 'icon-parking',
    color: '#4CAF50',
    type: 'parking'
  },
  // {
  //   title: '找厕所',
  //   subtitle: '便民信息 方便你我',
  //   icon: 'icon-toilet',
  //   color: '#FF9800',
  //   type: 'toilet'
  // },
  // {
  //   title: '星级旅行社',
  //   subtitle: '星级服务 星级品质',
  //   icon: 'icon-star',
  //   color: '#9575CD',
  //   type: 'agency'
  // },
  // {
  //   title: '星级导游',
  //   subtitle: '服务标兵 宾至如归',
  //   icon: 'icon-guide',
  //   color: '#03A9F4',
  //   type: 'guide'
  // },
  // {
  //   title: '一周天气',
  //   subtitle: '一手天气 尽在掌握',
  //   icon: 'icon-weather',
  //   color: '#FF4081',
  //   type: 'weather'
  // }
])

const handleService = (service) => {
  // 根据服务类型处理不同的跳转或操作
  switch (service.type) {
    case 'consultation':
      uni.makePhoneCall({
        phoneNumber: '12301'
      })
      break
    case 'complaint':
      uni.makePhoneCall({
        phoneNumber: '12301'
      })
      break
    case 'parking':
      uni.navigateTo({
        url: '/pages/parking/parking'
      })
      break
    // 其他服务类型的处理...
    default:
      uni.navigateTo({
        url: `/pages/service/detail?type=${service.type}`
      })
  }
}

onMounted(async () => {
  await request({
    url: '/tourism/type',
    method: 'GET',
    data: {
      type: 'carousel'
    },
  }).then(res => {
    carouselImages.value = res.data.data
  })
})
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 40rpx;
}

.header-image {
  width: 100%;
  height: 360rpx;
  overflow: hidden;
}

.header-image image {
  width: 100%;
  height: 100%;
}

.service-section {
  padding: 30rpx 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  padding-left: 10rpx;
}

.guarantee-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.public-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.service-card {
  border-radius: 16rpx;
  overflow: hidden;
  min-height: 160rpx;
  padding: 30rpx;
  position: relative;
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.card-text {
  flex: 1;
  padding-right: 20rpx;
}

.card-title {
  font-size: 32rpx;
  color: #fff;
  font-weight: bold;
  margin-bottom: 8rpx;
  display: block;
}

.card-subtitle {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
  display: block;
}

.iconfont {
  font-size: 48rpx;
  color: rgba(255, 255, 255, 0.9);
}

/* 确保图标垂直居中 */
.card-content .iconfont {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80rpx;
  height: 80rpx;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}
</style>
