<template>
  <view class="parking-info">
    <view class="info-section">
      <view class="info-item">
        <text class="info-label">停车场名称</text>
        <text class="info-value">{{ data.name }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">地址</text>
        <text class="info-value">{{ data.address }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">营业时间</text>
        <text class="info-value">{{ data.operatingHours }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">收费标准</text>
        <text class="info-value">{{ data.fee }}</text>
      </view>
    </view>

    <view class="status-section">
      <view class="section-title">实时状态</view>
      <view class="status-info">
        <view class="status-item">
          <text class="status-label">总车位</text>
          <text class="status-value">{{ data.totalSpaces }}</text>
        </view>
        <view class="status-item">
          <text class="status-label">剩余车位</text>
          <text class="status-value" :class="{'status-warning': data.availableSpaces < 10}">{{ data.availableSpaces }}</text>
        </view>
      </view>
    </view>

    <view class="notice-section" v-if="data.notice">
      <view class="section-title">停车须知</view>
      <text class="notice-text">{{ data.notice }}</text>
    </view>
  </view>
</template>

<script setup>
defineProps({
  data: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.parking-info {
  padding: 20rpx;
}

.info-section {
  background-color: #f8f8f8;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 30rpx;
}

.info-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  color: #666;
  font-size: 28rpx;
}

.info-value {
  color: #333;
  font-size: 28rpx;
  font-weight: 500;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.status-section {
  margin-bottom: 30rpx;
}

.status-info {
  display: flex;
  justify-content: space-around;
  background-color: #f8f8f8;
  border-radius: 12rpx;
  padding: 30rpx 20rpx;
}

.status-item {
  text-align: center;
}

.status-label {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 10rpx;
  display: block;
}

.status-value {
  font-size: 40rpx;
  color: #333;
  font-weight: bold;
}

.status-warning {
  color: #ff3b30;
}

.notice-section {
  background-color: #fff7e6;
  border-radius: 12rpx;
  padding: 20rpx;
}

.notice-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}
</style>