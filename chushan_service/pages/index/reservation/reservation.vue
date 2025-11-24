<template>
  <view class="container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-box">
        <text class="iconfont icon-search"></text>
        <input type="text" placeholder="搜索景点" v-model="searchText"/>
      </view>
    </view>

    <!-- 景点列表 -->
    <view class="scenic-list">
      <view class="scenic-item" v-for="(item, index) in scenicSpots" :key="index" @tap="goToDetail(item.id)">
        <image class="scenic-image" :src="item.image" mode="aspectFill"></image>
        <view class="scenic-content">
          <view class="scenic-title">{{ item.name }}</view>
          <view class="scenic-location">{{ item.location }}</view>
          <view class="scenic-desc">{{ item.description }}</view>
          <view class="scenic-footer">
            <view class="reservation-info">
              <text class="reservation-days">{{ item.reservationDays }}天可预约</text>
              <text class="reservation-count" v-if="item.reservationCount === 0">今日预约已满</text>
              <text class="reservation-count" v-else>余票：{{ item.reservationCount }}张</text>
            </view>
            <view class="reservation-btn" :class="{'disabled': item.reservationCount === 0}">
              立即预约
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import request from '../../../utils/request'

const searchText = ref('')

const scenicSpots = ref(null)

const goToDetail = (id) => {
  uni.navigateTo({
    url: `/pages/index/reservation/detail?id=${id}`
  })
}

onMounted(() => {
  request({
    url: '/tourism/type',
    method: 'GET',
    data: {
      type: 'scenic'
    },
  }).then(res => {
    scenicSpots.value = res.data.data
  })
})
</script>

<style scoped>
.container {
  background-color: #F5F5F5;
  min-height: 100vh;
}

/* 搜索栏样式 */
.search-bar {
  background-color: #FFFFFF;
  padding: 20rpx;
  position: sticky;
  top: 0;
  z-index: 100;
}

.search-box {
  display: flex;
  align-items: center;
  background-color: #F5F5F5;
  padding: 16rpx 30rpx;
  border-radius: 36rpx;
}

.search-box .icon-search {
  font-size: 32rpx;
  color: #999;
  margin-right: 10rpx;
}

.search-box input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

/* 景点列表样式 */
.scenic-list {
  padding: 20rpx;
}

.scenic-item {
  background-color: #FFFFFF;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
}

.scenic-image {
  width: 100%;
  height: 300rpx;
}

.scenic-content {
  padding: 20rpx;
}

.scenic-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 12rpx;
}

.scenic-location {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 12rpx;
}

.scenic-desc {
  font-size: 26rpx;
  color: #999;
  line-height: 1.5;
  margin-bottom: 20rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.scenic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #F5F5F5;
  padding-top: 20rpx;
}

.reservation-info {
  display: flex;
  flex-direction: column;
}

.reservation-days {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 4rpx;
}

.reservation-count {
  font-size: 24rpx;
  color: #FF4444;
}

.reservation-btn {
  background-color: #32C5FF;
  color: white;
  font-size: 28rpx;
  padding: 12rpx 32rpx;
  border-radius: 32rpx;
}

.reservation-btn.disabled {
  background-color: #CCCCCC;
}
</style> 