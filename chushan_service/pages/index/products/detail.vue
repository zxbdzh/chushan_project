<template>
  <view class="container">
    <!-- 优化图片展示为轮播图 -->
    <swiper class="swiper" indicator-active-color="#4cd964">
      <swiper-item v-for="(img, index) in productDetail.images" :key="index" v-if="productDetail.images">
        <image :src="img" mode="aspectFit" class="slide-image"/>
      </swiper-item>
      <image :src="productDetail.image" mode="aspectFit" class="slide-image" v-else/>
    </swiper>

    <!-- 新增标签展示 -->
    <view class="tags">
      <text v-for="(tag, index) in productDetail.tags" :key="index" class="tag">{{ tag }}</text>
    </view>

    <!-- 扩展商品信息 -->
    <view class="content">
      <view class="title">{{ productDetail.name }}</view>
      <view class="meta-line">
        <text class="label">发布时间：</text>
        <text class="time">{{ productDetail.time }}</text>
      </view>

      <!-- 新增规格参数 -->
      <view class="specs">
        <view class="spec-item" v-for="(value, key) in productDetail.specs" :key="key">
          <text class="spec-label">{{ key }}：</text>
          <text class="spec-value">{{ value }}</text>
        </view>
      </view>

      <view class="divider"></view>
      <view class="description">
        {{ productDetail.description }}
      </view>
    </view>
  </view>
</template>
<script setup>
import {ref} from 'vue'
import {onLoad} from '@dcloudio/uni-app'
import request from "../../../utils/request";

const productDetail = ref({})

onLoad((options) => {
  request({
    url: '/tourism/type',
    method: 'GET',
    data: {
      type: 'product'
    },
  }).then(res => {
    const foundProduct = res.data.data.find(product => product.id === Number(options.id))
    if (!foundProduct) {
      uni.showToast({
        title: '商品不存在',
        icon: 'none'
      })
      return
    }
    productDetail.value = foundProduct
    productDetail.value.tags = JSON.parse(productDetail.value.tags)
    productDetail.value.specs = JSON.parse(productDetail.value.specs)
  })
})
const goBack = () => {
  uni.navigateBack()
}

const handleShare = () => {
  // 这里可以添加分享逻辑
  uni.showToast({
    title: '分享功能待实现'
  })
}
</script>

<style scoped>
/* 新增样式 */
.nav-bar {
  position: fixed;
  top: 0;
  width: 100%;
  padding: 20rpx 30rpx;
  display: flex;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.9);
  z-index: 100;
}

.icon {
  width: 48rpx;
  height: 48rpx;
}

.swiper {
  height: 500rpx;
  margin-top: 80rpx;
}

.slide-image {
  width: 100%;
  height: 100%;
}

.tags {
  padding: 20rpx 30rpx;
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.tag {
  background: #f5f5f5;
  padding: 8rpx 20rpx;
  border-radius: 40rpx;
  font-size: 24rpx;
  color: #666;
}

.specs {
  margin: 30rpx 0;
}

.spec-item {
  display: flex;
  margin-bottom: 20rpx;
  font-size: 28rpx;
}

.spec-label {
  color: #999;
  min-width: 180rpx;
}

.spec-value {
  color: #666;
  flex: 1;
}

.container {
  background-color: #ffffff;
  min-height: 100vh;
}

.nav-bar {
  position: relative;
  padding: 20rpx 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.main-image {
  width: 100%;
  max-height: 500rpx;
}

.content {
  padding: 40rpx 30rpx;
}

.title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.meta {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
}

.time {
  font-size: 28rpx;
  color: #999;
}

.divider {
  height: 2rpx;
  background-color: #eee;
  margin: 40rpx 0;
}

.description {
  font-size: 30rpx;
  color: #666;
  line-height: 1.6;
}
</style>
