<template>
  <view class="container">
    <!-- 头部轮播图 -->
    <view class="header-image">
      <swiper class="swiper" circular autoplay interval="4000" duration="500" indicator-dots
              indicator-color="rgba(255, 255, 255, 0.6)" indicator-active-color="#FFFFFF">
        <swiper-item v-for="(item, index) in carouselImages" :key="index">
          <image :src="item.image" mode="aspectFill"></image>
        </swiper-item>
      </swiper>
    </view>

    <!-- 四个圆形菜单 -->
    <view class="menu-circles">
      <view class="menu-circle-item" v-for="(item, index) in menuItems" :key="index" @tap="navigateTo(item.url)">
        <view class="circle-icon" :style="{ backgroundColor: item.color }">
          <image :src="item.icon_src" mode="aspectFit"></image>
        </view>
        <text class="circle-text">{{ item.title }}</text>
      </view>
    </view>

    <!-- 游玩指南 -->
    <view class="guide-section">
      <view class="section-title">游玩指南</view>
      <view class="guide-cards">
        <view class="guide-card green" @tap="navigateTo('/pages/index/overview/overview')">
          <view class="card-title">景区概况</view>
          <view class="card-subtitle">服务游客 助力旅游</view>
        </view>
        <view class="guide-cards-right">
          <view class="guide-card orange" @tap="navigateTo('/pages/parking/parking')">
            <view class="card-title">停车预约</view>
            <view class="card-subtitle">景区停车更便捷</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 景点推荐轮播 -->
    <view class="featured-section">
      <view class="section-title">景点推荐</view>
      <swiper class="featured-swiper" circular autoplay interval="4000" duration="500" indicator-dots
              indicator-color="rgba(0, 0, 0, 0.3)" indicator-active-color="#FF9500">
        <swiper-item v-for="(item, index) in featuredItems" :key="index" @tap="navigateTo(item.url)">
          <view class="featured-item">
            <image :src="item.image" mode="aspectFill"></image>
            <view class="featured-info">
              <text class="featured-name">{{ item.name }}</text>
              <text class="featured-desc">{{ item.description }}</text>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <!-- 旅游人气榜 -->
    <view class="popular-section">
      <view class="section-title">旅游人气榜</view>
      <view class="popular-item" v-for="(item, index) in popularItems" :key="index" @tap="navigateTo(item.url)">
        <view class="popular-rank" :class="{ 'top-rank': index < 3 }">{{ index + 1 }}</view>
        <view class="popular-info">
          <text class="popular-name">{{ item.name }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import request from "../../utils/request";

const featuredItems = ref(null)

const menuItems = ref([
  {
    "title": "景区动态",
    "icon_src": "/static/icon/动态.png",
    "color": "#4CD964",
    "url": "/pages/index/news/news"
  },
  {
    "title": "景点预约",
    "icon_src": "/static/icon/预约.png",
    "color": "#32C5FF",
    "url": "/pages/index/reservation/reservation"
  },
  {
    "title": "房间预约",
    "icon_src": "/static/icon/美食.png",
    "color": "#FF9500",
    "url": "/pages/index/room-reservation/room-reservation"
  },
  {
    "title": "特产",
    "icon_src": "/static/icon/特产.png",
    "color": "#FF2D70",
    "url": "/pages/index/products/products"
  }
])

const carouselImages = ref(null)

const popularItems = ref(null)

const navigateTo = (url) => {
  uni.navigateTo({
    url: url
  })
}

onMounted(() => {
  request({
    url: '/tourism/type',
    method: 'GET',
    data: {
      type: 'featured'
    },
  }).then(res => {
    featuredItems.value = res.data.data
  })

  request({
    url: '/tourism/type',
    method: 'GET',
    data: {
      type: 'popular'
    },
  }).then(res => {
    popularItems.value = res.data.data
  })

  request({
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
  display: flex;
  flex-direction: column;
  background-color: #F5F5F5;
  min-height: 100vh;
}

/* 头部轮播图 */
.header-image {
  position: relative;
  width: 100%;
  height: 200px;
}

.header-image .swiper {
  width: 100%;
  height: 100%;
}

.header-image image {
  width: 100%;
  height: 100%;
}

/* 四个圆形菜单 */
.menu-circles {
  display: flex;
  justify-content: space-around;
  padding: 30rpx 20rpx;
  background-color: #FFFFFF;
  margin-bottom: 20rpx;
}

.menu-circle-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.circle-icon {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10rpx;
  color: white;
  font-size: 40rpx;
}

.circle-icon image {
  width: 70rpx;
  height: 70rpx;
  filter: brightness(0) invert(1);
}

.circle-text {
  font-size: 24rpx;
  color: #333;
}

/* 游玩指南 */
.guide-section {
  background-color: #FFFFFF;
  padding: 30rpx 20rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  color: #333;
}

.guide-cards {
  display: flex;
  justify-content: space-between;
}

.guide-card {
  padding: 30rpx;
  border-radius: 20rpx;
  color: white;
}

.green {
  background-color: #4CD964;
  width: 45%;
}

.guide-cards-right {
  width: 45%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.blue {
  background-color: #32C5FF;
  height: 110rpx;
  margin-bottom: 20rpx;
}

.orange {
  background-color: #FF9500;
  height: 110rpx;
}

.card-title {
  font-size: 30rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.card-subtitle {
  font-size: 24rpx;
  opacity: 0.8;
}

/* 旅游人气榜 */
.popular-section {
  background-color: #FFFFFF;
  padding: 30rpx 20rpx;
  margin-bottom: 100rpx;
  /* 为底部导航留出空间 */
}

.popular-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1px solid #F0F0F0;
}

.popular-rank {
  width: 40rpx;
  height: 40rpx;
  background-color: #EEEEEE;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20rpx;
  font-size: 24rpx;
  color: #666;
}

.top-rank {
  background-color: #FF9500;
  color: white;
}

.popular-name {
  font-size: 28rpx;
  color: #333;
}

/* 景点推荐轮播 */
.featured-section {
  background-color: #FFFFFF;
  padding: 30rpx 20rpx;
  margin-bottom: 20rpx;
}

.featured-swiper {
  width: 100%;
  height: 360rpx;
}

.featured-item {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 16rpx;
  overflow: hidden;
}

.featured-item image {
  width: 100%;
  height: 100%;
}

.featured-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  color: white;
}

.featured-name {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
  display: block;
}

.featured-desc {
  font-size: 24rpx;
  opacity: 0.9;
}

/* 旅游人气榜 */
</style>
