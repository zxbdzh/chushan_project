<template>
	<view class="container">
		<!-- 搜索栏 -->
		<view class="search-bar">
			<view class="search-box">
				<image src="/static/icon/search.png" class="search-icon" mode="aspectFit"></image>
				<input type="text" placeholder="搜索" v-model="searchText" />
			</view>
		</view>

		<!-- 停车场列表 -->
		<view class="parking-list">
			<view class="parking-item" v-for="(item, index) in parkingList" :key="index">
				<view class="parking-content">
					<view class="parking-title">{{item.name}}</view>
					<view class="parking-desc">{{item.description}}</view>
					<view class="parking-info">
						<text class="reservation-days">{{item.reservationDays}}天可预约</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from "../../utils/request";

const searchText = ref('')

const parkingList = ref(null)

onMounted(() => {
	request({
		url: '/tourism/type',
		method: 'GET',
		data: {
			type: 'parking'
		},
	}).then(res => {
		parkingList.value = res.data.data
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

.parking-list {
	padding: 20rpx;
}

.parking-item {
	background-color: #FFFFFF;
	border-radius: 16rpx;
	margin-bottom: 20rpx;
	overflow: hidden;
}

.parking-content {
	padding: 30rpx;
}

.parking-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 16rpx;
}

.parking-desc {
	font-size: 26rpx;
	color: #666;
	line-height: 1.5;
	margin-bottom: 16rpx;
}

.parking-info {
	display: flex;
	align-items: center;
}

.reservation-days {
	font-size: 24rpx;
	color: #999;
}
</style> 