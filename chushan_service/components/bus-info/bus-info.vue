<template>
  <view class="bus-info">
    <view class="info-section">
      <view class="info-item">
        <text class="info-label">线路名称</text>
        <text class="info-value">{{ data.routeName }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">运营时间</text>
        <text class="info-value">{{ data.operatingHours }}</text>
      </view>
      <view class="info-item">
        <text class="info-label">票价信息</text>
        <text class="info-value">{{ data.fare }}</text>
      </view>
    </view>

    <view class="station-section">
      <view class="section-title">站点信息</view>
      <view class="station-list">
        <view class="station-item" v-for="(station, index) in data.stations" :key="index">
          <view class="station-dot" :class="{'current': station.isCurrent}"></view>
          <view class="station-info">
            <text class="station-name">{{ station.name }}</text>
            <text class="station-time" v-if="station.arrivalTime">预计到达: {{ station.arrivalTime }}</text>
          </view>
        </view>
      </view>
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
.bus-info {
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

.station-list {
  position: relative;
}

.station-item {
  display: flex;
  align-items: flex-start;
  padding: 20rpx 0;
  position: relative;
}

.station-dot {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  background-color: #ddd;
  margin-right: 20rpx;
  margin-top: 10rpx;
}

.station-dot.current {
  background-color: #007AFF;
  box-shadow: 0 0 0 6rpx rgba(0,122,255,0.2);
}

.station-info {
  flex: 1;
}

.station-name {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 4rpx;
}

.station-time {
  font-size: 24rpx;
  color: #007AFF;
}
</style>