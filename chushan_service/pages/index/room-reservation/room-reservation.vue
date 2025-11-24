<template>
  <view class="container">
    <!-- 头部信息 -->
    <view class="header">
      <text class="title">房间预约</text>
      <text class="subtitle">选择您心仪的房间</text>
    </view>

    <!-- 房间列表 -->
    <view class="room-list">
      <view class="room-item" v-for="(room, index) in roomList" :key="room.id" @tap="selectRoom(room)">
        <view class="room-image">
          <image :src="room.image || '/static/icon/room-default.png'" mode="aspectFill"></image>
          <view class="room-status" :class="{ 'available': room.availableCount > 0, 'unavailable': room.availableCount <= 0 }">
            {{ room.availableCount > 0 ? '可预约' : '已满' }}
          </view>
        </view>
        <view class="room-info">
          <view class="room-header">
            <text class="room-name">{{ room.name }}</text>
            <text class="room-price">¥{{ room.price }}/晚</text>
          </view>
          <text class="room-type">{{ room.type }}</text>
          <text class="room-desc">{{ room.description }}</text>
          <view class="room-details">
            <text class="room-capacity">可住{{ room.capacity }}人</text>
            <text class="room-available">剩余{{ room.availableCount }}间</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 预约表单弹窗 -->
    <view class="popup-overlay" v-if="showPopup" @tap="closePopup">
      <view class="popup-content" @tap.stop>
        <view class="popup-header">
          <text class="popup-title">预约房间</text>
          <text class="close-btn" @tap="closePopup">×</text>
        </view>
        
        <view class="form-section">
          <view class="selected-room">
            <text class="selected-room-name">{{ selectedRoom.name }}</text>
            <text class="selected-room-price">¥{{ selectedRoom.price }}/晚</text>
          </view>

          <view class="form-item">
            <text class="form-label">预约人姓名 *</text>
            <input class="form-input" v-model="reservationForm.customerName" placeholder="请输入真实姓名" />
          </view>

          <view class="form-item">
            <text class="form-label">手机号 *</text>
            <input class="form-input" v-model="reservationForm.phoneNumber" placeholder="请输入手机号" type="number" />
          </view>



          <view class="form-item">
            <text class="form-label">预约日期 *</text>
            <picker mode="date" :value="reservationForm.reservationDate" @change="onDateChange" :start="today">
              <view class="picker-input">
                <text>{{ reservationForm.reservationDate || '请选择预约日期' }}</text>
                <text class="picker-arrow">></text>
              </view>
            </picker>
          </view>

          <view class="form-item">
            <text class="form-label">入住时间 *</text>
            <picker mode="time" :value="reservationForm.checkInTime" @change="onCheckInTimeChange">
              <view class="picker-input">
                <text>{{ reservationForm.checkInTime || '请选择入住时间' }}</text>
                <text class="picker-arrow">></text>
              </view>
            </picker>
          </view>

          <view class="form-item">
            <text class="form-label">退房时间 *</text>
            <picker mode="time" :value="reservationForm.checkOutTime" @change="onCheckOutTimeChange">
              <view class="picker-input">
                <text>{{ reservationForm.checkOutTime || '请选择退房时间' }}</text>
                <text class="picker-arrow">></text>
              </view>
            </picker>
          </view>

          <view class="form-item">
            <text class="form-label">房间数量 *</text>
            <view class="quantity-selector">
              <text class="quantity-btn" @tap="decreaseQuantity">-</text>
              <text class="quantity-value">{{ reservationForm.roomCount }}</text>
              <text class="quantity-btn" @tap="increaseQuantity">+</text>
            </view>
          </view>

          <view class="form-item">
            <text class="form-label">备注</text>
            <textarea class="form-textarea" v-model="reservationForm.notes" placeholder="请输入备注信息（选填）" />
          </view>

          <view class="total-price">
            <text class="total-label">总价格：</text>
            <text class="total-amount">¥{{ totalPrice }}</text>
          </view>

          <view class="form-actions">
            <button class="cancel-btn" @tap="closePopup">取消</button>
            <button class="submit-btn" @tap="submitReservation">确认预约</button>
          </view>
        </view>
      </view>
    </view>

    <!-- 我的预约按钮 -->
    <view class="my-reservations-btn" @tap="goToMyReservations">
      <text>我的预约</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import request from '../../../utils/request'

const showPopup = ref(false)
const roomList = ref([])
const selectedRoom = ref({})
const loading = ref(false)



// 获取今天的日期
const today = computed(() => {
  const date = new Date()
  return date.toISOString().split('T')[0]
})

// 预约表单数据
const reservationForm = ref({
  customerName: '',
  phoneNumber: '',
  reservationDate: '',
  checkInTime: '14:00',
  checkOutTime: '12:00',
  roomCount: 1,
  notes: ''
})

// 计算总价格
const totalPrice = computed(() => {
  return (selectedRoom.value.price || 0) * reservationForm.value.roomCount
})

// 获取房间列表
const fetchRoomList = async () => {
  loading.value = true
  try {
    const res = await request({
      url: '/api/rooms/list',
      method: 'GET'
    })
    if (res.data.code === 200) {
      roomList.value = res.data.data || []
    } else {
      uni.showToast({
        title: res.data.message || '获取房间列表失败',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('获取房间列表失败:', error)
    uni.showToast({
      title: '网络错误，请重试',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 选择房间
const selectRoom = (room) => {
  if (room.availableCount <= 0) {
    uni.showToast({
      title: '该房间已满，请选择其他房间',
      icon: 'none'
    })
    return
  }
  
  selectedRoom.value = room
  resetForm()
  showPopup.value = true
}

// 重置表单
const resetForm = () => {
  reservationForm.value = {
    customerName: '',
    phoneNumber: '',
    reservationDate: '',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    roomCount: 1,
    notes: ''
  }
}

// 关闭弹窗
const closePopup = () => {
  showPopup.value = false
}

// 日期选择
const onDateChange = (e) => {
  reservationForm.value.reservationDate = e.detail.value
}

// 入住时间选择
const onCheckInTimeChange = (e) => {
  reservationForm.value.checkInTime = e.detail.value
}

// 退房时间选择
const onCheckOutTimeChange = (e) => {
  reservationForm.value.checkOutTime = e.detail.value
}

// 减少房间数量
const decreaseQuantity = () => {
  if (reservationForm.value.roomCount > 1) {
    reservationForm.value.roomCount--
  }
}

// 增加房间数量
const increaseQuantity = () => {
  if (reservationForm.value.roomCount < selectedRoom.value.availableCount) {
    reservationForm.value.roomCount++
  } else {
    uni.showToast({
      title: '超过可预约数量',
      icon: 'none'
    })
  }
}



// 表单验证
const validateForm = async () => {
  const { customerName, phoneNumber, reservationDate, checkInTime, checkOutTime } = reservationForm.value
  
  if (!customerName.trim()) {
    uni.showToast({ title: '请输入预约人姓名', icon: 'none' })
    return false
  }
  
  if (!phoneNumber.trim()) {
    uni.showToast({ title: '请输入手机号', icon: 'none' })
    return false
  }
  
  if (!/^1[3-9]\d{9}$/.test(phoneNumber)) {
    uni.showToast({ title: '请输入正确的手机号格式', icon: 'none' })
    return false
  }
  
  if (!reservationDate) {
    uni.showToast({ title: '请选择预约日期', icon: 'none' })
    return false
  }
  
  if (!checkInTime) {
    uni.showToast({ title: '请选择入住时间', icon: 'none' })
    return false
  }
  
  if (!checkOutTime) {
    uni.showToast({ title: '请选择退房时间', icon: 'none' })
    return false
  }
  
  return true
}

// 提交预约
const submitReservation = async () => {
  if (!(await validateForm())) {
    return
  }
  
  loading.value = true
  
  try {
    const requestData = {
      ...reservationForm.value,
      roomId: selectedRoom.value.id,
      roomName: selectedRoom.value.name,
      roomType: selectedRoom.value.type,
      totalPrice: totalPrice.value
    }
    
    const res = await request({
      url: '/api/room-reservations',
      method: 'POST',
      data: requestData
    })
    
    if (res.data.code === 200) {
      uni.showToast({
        title: '预约成功',
        icon: 'success'
      })
      closePopup()
      fetchRoomList() // 刷新房间列表
    } else {
      uni.showToast({
        title: res.data.message || '预约失败',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('预约失败:', error)
    uni.showToast({
      title: '网络错误，请重试',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 跳转到我的预约页面
const goToMyReservations = () => {
  uni.navigateTo({
    url: '/pages/index/room-reservation/my-reservations'
  })
}

// 页面加载时获取房间列表
onMounted(() => {
  fetchRoomList()
})
</script>

<style scoped>
.container {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 120rpx;
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
  align-items: flex-end;
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

.room-list {
  padding: 20rpx;
}

.room-item {
  background: white;
  border-radius: 20rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.room-image {
  position: relative;
  height: 300rpx;
}

.room-image image {
  width: 100%;
  height: 100%;
}

.room-status {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  color: white;
  font-weight: bold;
}

.room-status.available {
  background-color: #4cd964;
}

.room-status.unavailable {
  background-color: #ff3b30;
}

.room-info {
  padding: 30rpx;
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.room-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.room-price {
  font-size: 32rpx;
  color: #ff6b35;
  font-weight: bold;
}

.room-type {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.room-desc {
  font-size: 26rpx;
  color: #999;
  line-height: 1.5;
  margin-bottom: 20rpx;
}

.room-details {
  display: flex;
  justify-content: space-between;
  font-size: 24rpx;
  color: #666;
}

.popup-content {
  background: white;
  border-radius: 20rpx 20rpx 0 0;
  max-height: 80vh;
  overflow-y: auto;
  width: 100%;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #eee;
}

.popup-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.close-btn {
  font-size: 60rpx;
  color: #999;
  line-height: 1;
}

.form-section {
  padding: 30rpx;
}

.selected-room {
  background: #f8f9fa;
  padding: 20rpx;
  border-radius: 10rpx;
  margin-bottom: 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.selected-room-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.selected-room-price {
  font-size: 28rpx;
  color: #ff6b35;
  font-weight: bold;
}

.form-item {
  margin-bottom: 30rpx;
}

.form-label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 20rpx;
  border: 1rpx solid #ddd;
  border-radius: 10rpx;
  font-size: 28rpx;
  background: #fafafa;
}

.form-textarea {
  width: 100%;
  padding: 20rpx;
  border: 1rpx solid #ddd;
  border-radius: 10rpx;
  font-size: 28rpx;
  background: #fafafa;
  min-height: 120rpx;
}

.picker-input {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  border: 1rpx solid #ddd;
  border-radius: 10rpx;
  background: #fafafa;
  font-size: 28rpx;
}

.picker-arrow {
  color: #999;
  font-size: 24rpx;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.quantity-btn {
  width: 60rpx;
  height: 60rpx;
  border: 1rpx solid #ddd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: #666;
  background: #fafafa;
}

.quantity-value {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  min-width: 60rpx;
  text-align: center;
}

.total-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-top: 1rpx solid #eee;
  margin-top: 20rpx;
}

.total-label {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
}

.total-amount {
  font-size: 36rpx;
  color: #ff6b35;
  font-weight: bold;
}

.form-actions {
  display: flex;
  gap: 20rpx;
  margin-top: 40rpx;
}

.cancel-btn {
  flex: 1;
  padding: 24rpx;
  border: 1rpx solid #ddd;
  border-radius: 10rpx;
  background: white;
  color: #666;
  font-size: 28rpx;
}

.submit-btn {
  flex: 2;
  padding: 24rpx;
  border: none;
  border-radius: 10rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 28rpx;
  font-weight: bold;
}

.my-reservations-btn {
  position: fixed;
  bottom: 40rpx;
  right: 40rpx;
  width: 120rpx;
  height: 120rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24rpx;
  font-weight: bold;
  box-shadow: 0 8rpx 30rpx rgba(102, 126, 234, 0.4);
}


</style>