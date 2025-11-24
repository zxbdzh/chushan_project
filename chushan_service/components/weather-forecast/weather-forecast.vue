<template>
  <view class="weather-forecast">
    <view class="current-weather">
      <view class="weather-main">
        <text class="temperature">{{ data.currentTemp }}°</text>
        <text class="weather-desc">{{ data.weatherDesc }}</text>
      </view>
      <view class="weather-details">
        <view class="detail-item">
          <text class="detail-label">湿度</text>
          <text class="detail-value">{{ data.humidity }}%</text>
        </view>
        <view class="detail-item">
          <text class="detail-label">风速</text>
          <text class="detail-value">{{ data.windSpeed }}km/h</text>
        </view>
        <view class="detail-item">
          <text class="detail-label">气压</text>
          <text class="detail-value">{{ data.pressure }}hPa</text>
        </view>
      </view>
    </view>

    <view class="forecast-section">
      <view class="section-title">未来天气预报</view>
      <view class="forecast-list">
        <view class="forecast-item" v-for="(item, index) in data.forecast" :key="index">
          <text class="forecast-day">{{ item.day }}</text>
          <text class="forecast-temp">{{ item.tempMin }}° / {{ item.tempMax }}°</text>
          <text class="forecast-desc">{{ item.weatherDesc }}</text>
        </view>
      </view>
    </view>

    <view class="weather-notice" v-if="data.notice">
      <view class="section-title">天气提醒</view>
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
.weather-forecast {
  padding: 20rpx;
}

.current-weather {
  background-color: #f8f8f8;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
}

.weather-main {
  text-align: center;
  margin-bottom: 30rpx;
}

.temperature {
  font-size: 80rpx;
  font-weight: bold;
  color: #333;
  line-height: 1;
}

.weather-desc {
  font-size: 32rpx;
  color: #666;
  margin-top: 10rpx;
  display: block;
}

.weather-details {
  display: flex;
  justify-content: space-around;
  border-top: 2rpx solid #eee;
  padding-top: 20rpx;
}

.detail-item {
  text-align: center;
}

.detail-label {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 6rpx;
  display: block;
}

.detail-value {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.forecast-list {
  background-color: #f8f8f8;
  border-radius: 12rpx;
  padding: 20rpx;
}

.forecast-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 2rpx solid #eee;
}

.forecast-item:last-child {
  border-bottom: none;
}

.forecast-day {
  font-size: 28rpx;
  color: #333;
  width: 120rpx;
}

.forecast-temp {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  flex: 1;
  text-align: center;
}

.forecast-desc {
  font-size: 28rpx;
  color: #666;
  width: 120rpx;
  text-align: right;
}

.weather-notice {
  margin-top: 30rpx;
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