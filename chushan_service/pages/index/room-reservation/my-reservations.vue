<template>
  <view class="container">
    <!-- 头部 -->
    <view class="header">
      <text class="title">我的预约</text>
      <text class="subtitle">管理您的房间预约</text>
    </view>

    <!-- 状态筛选 -->
    <view class="status-filter">
      <view 
        class="filter-item" 
        :class="{ active: currentStatus === item.value }"
        v-for="item in statusOptions" 
        :key="item.value"
        @tap="changeStatus(item.value)"
      >
        <text>{{ item.label }}</text>
      </view>
    </view>

    <!-- 手机号搜索 -->
    <view class="search-section">
      <view class="search-box">
        <input 
          class="search-input" 
          v-model="searchPhone" 
          placeholder="请输入手机号查询预约" 
          type="number"
          @input="onSearchInput"
        />
        <text class="search-btn" @tap="searchReservations">搜索</text>
      </view>
    </view>

    <!-- 预约列表 -->
    <view class="reservation-list" v-if="reservationList.length > 0">
      <view class="reservation-item" v-for="reservation in reservationList" :key="reservation.id">
        <view class="reservation-header">
          <text class="reservation-id">预约号：{{ reservation.id }}</text>
          <view class="status-tag" :class="getStatusClass(reservation.status)">
            {{ getStatusText(reservation.status) }}
          </view>
        </view>
        
        <view class="reservation-content">
          <view class="room-info">
            <text class="room-name">{{ reservation.roomName }}</text>
            <text class="room-type">{{ reservation.roomType }}</text>
          </view>
          
          <view class="reservation-details">
            <view class="detail-row">
              <text class="label">预约人：</text>
              <text class="value">{{ reservation.customerName }}</text>
            </view>
            <view class="detail-row">
              <text class="label">手机号：</text>
              <text class="value">{{ reservation.phoneNumber }}</text>
            </view>
            <view class="detail-row">
              <text class="label">预约日期：</text>
              <text class="value">{{ reservation.reservationDate }}</text>
            </view>
            <view class="detail-row">
              <text class="label">入住时间：</text>
              <text class="value">{{ reservation.checkInTime }}</text>
            </view>
            <view class="detail-row">
              <text class="label">退房时间：</text>
              <text class="value">{{ reservation.checkOutTime }}</text>
            </view>
            <view class="detail-row">
              <text class="label">房间数量：</text>
              <text class="value">{{ reservation.roomCount }}间</text>
            </view>
            <view class="detail-row">
              <text class="label">总价格：</text>
              <text class="value price">¥{{ reservation.totalPrice }}</text>
            </view>
            <view class="detail-row" v-if="reservation.notes">
              <text class="label">备注：</text>
              <text class="value">{{ reservation.notes }}</text>
            </view>
          </view>
        </view>
        
        <view class="reservation-actions">
          <button 
            class="action-btn detail-btn" 
            @tap="viewDetail(reservation)"
          >
            查看详情
          </button>
          <button 
            class="action-btn cancel-btn" 
            v-if="canCancel(reservation.status)"
            @tap="cancelReservation(reservation)"
          >
            取消预约
          </button>
        </view>
        
        <view class="reservation-footer">
          <text class="create-time">创建时间：{{ formatTime(reservation.createdAt) }}</text>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty-state" v-else-if="!loading">
      <image class="empty-icon" src="/static/icon/empty.png" mode="aspectFit"></image>
      <text class="empty-text">暂无预约记录</text>
      <button class="go-reserve-btn" @tap="goToReservation">去预约房间</button>
    </view>

    <!-- 加载状态 -->
    <view class="loading-state" v-if="loading">
      <text>加载中...</text>
    </view>

    <!-- 预约详情弹窗 -->
    <view class="popup-overlay" v-if="showDetailPopup" @tap="closeDetail">
      <view class="detail-popup" @tap.stop>
        <view class="detail-header">
          <text class="detail-title">预约详情</text>
          <text class="close-btn" @tap="closeDetail">×</text>
        </view>
        
        <view class="detail-content" v-if="selectedReservation">
          <view class="detail-section">
            <text class="section-title">基本信息</text>
            <view class="detail-grid">
              <view class="detail-item">
                <text class="item-label">预约号</text>
                <text class="item-value">{{ selectedReservation.id }}</text>
              </view>
              <view class="detail-item">
                <text class="item-label">状态</text>
                <view class="status-tag" :class="getStatusClass(selectedReservation.status)">
                  {{ getStatusText(selectedReservation.status) }}
                </view>
              </view>
            </view>
          </view>
          
          <view class="detail-section">
            <text class="section-title">房间信息</text>
            <view class="detail-grid">
              <view class="detail-item">
                <text class="item-label">房间名称</text>
                <text class="item-value">{{ selectedReservation.roomName }}</text>
              </view>
              <view class="detail-item">
                <text class="item-label">房间类型</text>
                <text class="item-value">{{ selectedReservation.roomType }}</text>
              </view>
            </view>
          </view>
          
          <view class="detail-section">
            <text class="section-title">预约信息</text>
            <view class="detail-grid">
              <view class="detail-item">
                <text class="item-label">预约人</text>
                <text class="item-value">{{ selectedReservation.customerName }}</text>
              </view>
              <view class="detail-item">
                <text class="item-label">手机号</text>
                <text class="item-value">{{ selectedReservation.phoneNumber }}</text>
              </view>

              <view class="detail-item">
                <text class="item-label">预约日期</text>
                <text class="item-value">{{ selectedReservation.reservationDate }}</text>
              </view>
              <view class="detail-item">
                <text class="item-label">入住时间</text>
                <text class="item-value">{{ selectedReservation.checkInTime }}</text>
              </view>
              <view class="detail-item">
                <text class="item-label">退房时间</text>
                <text class="item-value">{{ selectedReservation.checkOutTime }}</text>
              </view>
              <view class="detail-item">
                <text class="item-label">房间数量</text>
                <text class="item-value">{{ selectedReservation.roomCount }}间</text>
              </view>
              <view class="detail-item">
                <text class="item-label">总价格</text>
                <text class="item-value price">¥{{ selectedReservation.totalPrice }}</text>
              </view>
            </view>
          </view>
          
          <view class="detail-section" v-if="selectedReservation.notes">
            <text class="section-title">备注信息</text>
            <text class="notes-content">{{ selectedReservation.notes }}</text>
          </view>
          
          <view class="detail-section">
            <text class="section-title">时间信息</text>
            <view class="detail-grid">
              <view class="detail-item">
                <text class="item-label">创建时间</text>
                <text class="item-value">{{ formatTime(selectedReservation.createdAt) }}</text>
              </view>
              <view class="detail-item" v-if="selectedReservation.updatedAt">
                <text class="item-label">更新时间</text>
                <text class="item-value">{{ formatTime(selectedReservation.updatedAt) }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import request from '../../../utils/request'

const showDetailPopup = ref(false)
const reservationList = ref([])
const selectedReservation = ref(null)
const loading = ref(false)
const currentStatus = ref('')
const searchPhone = ref('')

// 状态选项
const statusOptions = ref([
  { label: '全部', value: '' },
  { label: '待确认', value: 'pending' },
  { label: '已确认', value: 'confirmed' },
  { label: '已取消', value: 'cancelled' },
  { label: '已完成', value: 'completed' }
])

// 根据手机号获取预约列表（移除分页功能）
const fetchReservations = async () => {
  // 如果没有手机号，清空列表
  if (!searchPhone.value.trim()) {
    reservationList.value = []
    return
  }
  
  loading.value = true
  try {
    const res = await request({
      url: '/api/room-reservations/by-phone',
      method: 'GET',
      data: { phoneNumber: searchPhone.value }
    })
    
    if (res.data.code === 200) {
      let results = res.data.data || []
      
      // 如果有状态筛选，进行前端过滤
      if (currentStatus.value) {
        results = results.filter(item => item.status === currentStatus.value)
      }
      
      reservationList.value = results
    } else {
      uni.showToast({
        title: res.data.message || '获取预约列表失败',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('获取预约列表失败:', error)
    uni.showToast({
      title: '网络错误，请重试',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}



// 状态切换
const changeStatus = (status) => {
  currentStatus.value = status
  // 不清空搜索手机号，重新筛选当前手机号的预约
  fetchReservations()
}

// 搜索输入
const onSearchInput = () => {
  if (!searchPhone.value) {
    fetchReservations()
  }
}

// 搜索预约
const searchReservations = () => {
  fetchReservations()
}

// 查看详情
const viewDetail = (reservation) => {
  selectedReservation.value = reservation
  showDetailPopup.value = true
}

// 关闭详情
const closeDetail = () => {
  showDetailPopup.value = false
}

// 取消预约
const cancelReservation = (reservation) => {
  uni.showModal({
    title: '确认取消',
    content: '确定要取消这个预约吗？取消后不可恢复。',
    success: async (res) => {
      if (res.confirm) {
        try {
          const response = await request({
            url: `/api/room-reservations/${reservation.id}/cancel`,
            method: 'PUT'
          })
          
          if (response.data.code === 200) {
            uni.showToast({
              title: '取消成功',
              icon: 'success'
            })
            // 刷新列表
            fetchReservations()
          } else {
            uni.showToast({
              title: response.data.message || '取消失败',
              icon: 'none'
            })
          }
        } catch (error) {
          console.error('取消预约失败:', error)
          uni.showToast({
            title: '网络错误，请重试',
            icon: 'none'
          })
        }
      }
    }
  })
}

// 判断是否可以取消
const canCancel = (status) => {
  return ['pending', 'confirmed'].includes(status)
}

// 获取状态样式类
const getStatusClass = (status) => {
  const classMap = {
    pending: 'status-pending',
    confirmed: 'status-confirmed',
    cancelled: 'status-cancelled',
    completed: 'status-completed'
  }
  return classMap[status] || ''
}

// 获取状态文本
const getStatusText = (status) => {
  const textMap = {
    pending: '待确认',
    confirmed: '已确认',
    cancelled: '已取消',
    completed: '已完成'
  }
  return textMap[status] || status
}

// 格式化时间
const formatTime = (timeStr) => {
  if (!timeStr) return ''
  const date = new Date(timeStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

// 跳转到预约页面
const goToReservation = () => {
  uni.navigateTo({
    url: '/pages/index/room-reservation/room-reservation'
  })
}

// 页面加载时获取预约列表
// onMounted(() => {
//   // fetchReservations()
// })
</script>

<style scoped>
.container {
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* 弹窗样式 */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40rpx 30rpx;
  color: white;
}

.title {
  font-size: 48rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 10rpx;
}

.subtitle {
  font-size: 28rpx;
  opacity: 0.9;
}

.status-filter {
  display: flex;
  background: white;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.filter-item {
  flex: 1;
  text-align: center;
  padding: 20rpx 10rpx;
  font-size: 28rpx;
  color: #666;
  border-radius: 10rpx;
  margin: 0 5rpx;
}

.filter-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.search-section {
  padding: 0 20rpx 20rpx;
}

.search-box {
  display: flex;
  background: white;
  border-radius: 10rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.search-input {
  flex: 1;
  padding: 24rpx 20rpx;
  font-size: 28rpx;
  border: none;
}

.search-btn {
  padding: 24rpx 30rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 28rpx;
  font-weight: bold;
}

.reservation-list {
  padding: 0 20rpx;
}

.reservation-item {
  background: white;
  border-radius: 20rpx;
  margin-bottom: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.reservation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.reservation-id {
  font-size: 28rpx;
  color: #666;
}

.status-tag {
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  color: white;
  font-weight: bold;
}

.status-pending {
  background-color: #ff9500;
}

.status-confirmed {
  background-color: #4cd964;
}

.status-cancelled {
  background-color: #ff3b30;
}

.status-completed {
  background-color: #007aff;
}

.reservation-content {
  margin-bottom: 20rpx;
}

.room-info {
  margin-bottom: 20rpx;
}

.room-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 5rpx;
}

.room-type {
  font-size: 28rpx;
  color: #666;
}

.reservation-details {
  border-top: 1rpx solid #eee;
  padding-top: 20rpx;
}

.detail-row {
  display: flex;
  margin-bottom: 10rpx;
  align-items: center;
}

.label {
  font-size: 26rpx;
  color: #666;
  width: 160rpx;
  flex-shrink: 0;
}

.value {
  font-size: 26rpx;
  color: #333;
  flex: 1;
}

.value.price {
  color: #ff6b35;
  font-weight: bold;
}

.reservation-actions {
  display: flex;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.action-btn {
  flex: 1;
  padding: 20rpx;
  border-radius: 10rpx;
  font-size: 26rpx;
  border: none;
}

.detail-btn {
  background: #f0f0f0;
  color: #333;
}

.cancel-btn {
  background: #ff3b30;
  color: white;
}

.reservation-footer {
  border-top: 1rpx solid #eee;
  padding-top: 15rpx;
}

.create-time {
  font-size: 24rpx;
  color: #999;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 40rpx;
}

.empty-icon {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 30rpx;
  opacity: 0.5;
}

.empty-text {
  font-size: 32rpx;
  color: #999;
  margin-bottom: 40rpx;
}

.go-reserve-btn {
  padding: 24rpx 48rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50rpx;
  font-size: 28rpx;
  border: none;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100rpx;
  font-size: 28rpx;
  color: #999;
}

.detail-popup {
  background: white;
  border-radius: 20rpx;
  width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
  animation: fadeInScale 0.3s ease-out;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #eee;
}

.detail-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.close-btn {
  font-size: 60rpx;
  color: #999;
  line-height: 1;
}

.detail-content {
  padding: 30rpx;
}

.detail-section {
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.item-label {
  font-size: 24rpx;
  color: #666;
}

.item-value {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.notes-content {
  font-size: 28rpx;
  color: #333;
  line-height: 1.5;
  background: #f8f9fa;
  padding: 20rpx;
  border-radius: 10rpx;
}

.detail-actions {
  padding: 30rpx;
  border-top: 1rpx solid #eee;
}

.detail-close-btn {
  width: 100%;
  padding: 24rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 10rpx;
  font-size: 28rpx;
  border: none;
}
</style>