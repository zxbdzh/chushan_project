<template>
  <view class="container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-box">
        <text class="iconfont icon-search"></text>
        <input type="text" placeholder="搜索标题" v-model="searchText"/>
      </view>
    </view>

    <!-- 新闻列表 -->
    <view class="news-list">
      <view class="news-item" v-for="(item, index) in newsList" :key="index" @tap="goToDetail(item.id)">
        <image class="news-image" :src="item.image" mode="aspectFill"></image>
        <view class="news-content">
          <view class="news-title">{{ item.name }}</view>
          <view class="news-info">
            <text class="news-tag" :style="{backgroundColor: item.tagColor}">{{ item.tag }}</text>
            <text class="news-time">{{ item.time }}</text>
          </view>
          <view class="news-desc">{{ item.description }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import {ref} from 'vue'
import request from "../../../utils/request";
import {onMounted} from 'vue';

const searchText = ref('')

const newsList = ref(null)

const goToDetail = (id) => {
  uni.navigateTo({
    url: `/pages/news/detail?id=${id}`
  })
}

onMounted(() => {
  request({
    url: '/tourism/type',
    method: 'GET',
    data: {
      type: 'news'
    }
  }).then(res => {
    newsList.value = res.data.data
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

/* 新闻列表样式 */
.news-list {
  padding: 20rpx;
}

.news-item {
  background-color: #FFFFFF;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
}

.news-image {
  width: 100%;
  height: 360rpx;
}

.news-content {
  padding: 20rpx;
}

.news-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
}

.news-info {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.news-tag {
  padding: 4rpx 16rpx;
  border-radius: 6rpx;
  font-size: 24rpx;
  color: #FFFFFF;
  margin-right: 16rpx;
}

.news-time {
  font-size: 24rpx;
  color: #999;
}

.news-desc {
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
