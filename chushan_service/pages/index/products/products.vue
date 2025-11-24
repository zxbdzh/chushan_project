<template>
  <view class="container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-box">
        <image src="/static/icon/search.png" class="search-icon" mode="aspectFit"></image>
        <input type="text" placeholder="搜索标题" v-model="searchText"/>
      </view>
    </view>

    <!-- 特产列表 -->
    <view class="product-list">
      <view class="product-item" v-for="(item, index) in productList" :key="index" @tap="goToDetail(item.id)">
        <image class="product-image" :src="item.image" mode="aspectFill"></image>
        <view class="product-content">
          <view class="product-title">{{ item.name }}</view>
          <view class="product-desc">{{ item.description }}</view>
          <view class="product-time">{{ item.time }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import request from "../../../utils/request";

const searchText = ref('')

const productList = ref(null)

const goToDetail = (id) => {
  uni.navigateTo({
    url: `/pages/index/products/detail?id=${id}`
  })
}

onMounted(() => {
  request({
    url: '/tourism/type',
    method: 'GET',
    data: {
      type: 'product'
    },
  }).then(res => {
    productList.value = res.data.data
  })
})

</script>

<style scoped>
.container {
  background-color: #F5F5F5;
  min-height: 100vh;
}

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

.search-box .search-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: 10rpx;
}

.search-box input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.product-list {
  padding: 20rpx;
}

.product-item {
  background-color: #FFFFFF;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
  display: flex;
}

.product-image {
  width: 200rpx;
  height: 200rpx;
  flex-shrink: 0;
}

.product-content {
  flex: 1;
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.product-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.product-time {
  font-size: 24rpx;
  color: #999;
  text-align: right;
}
</style> 