<template>
	<view class="container">
		<!-- 轮播图 -->
		<swiper class="swiper" circular autoplay interval="4000" duration="500" indicator-dots
			indicator-color="rgba(255, 255, 255, 0.6)" indicator-active-color="#FFFFFF">
			<!--      <swiper-item v-for="(item, index) in detail.images" :key="index">-->
			<!--        <image :src="item" mode="aspectFill" class="swiper-image"/>-->
			<!--      </swiper-item>-->
			<image :src="detail.image" mode="aspectFill" class="swiper-image" />

		</swiper>

		<!-- 基本信息 -->
		<view class="info-section">
			<view class="title">{{ detail.name }}</view>
			<view class="tags">
				<text class="tag" v-for="(tag, index) in detail.tags" :key="index">{{ tag }}</text>
			</view>
			<view class="score-info">
				<text class="score">{{ detail.score }}分</text>
				<text class="visit-count">{{ detail.visitCount }}人来过</text>
				<text class="comment-count">{{ detail.commentCount }}条评论</text>
			</view>
		</view>

		<!-- 景点介绍 -->
		<view class="detail-section">
			<view class="section-title">景点介绍</view>
			<view class="detail-text">{{ detail.description }}</view>
		</view>

		<!-- 开放信息 -->
		<view class="detail-section">
			<view class="section-title">开放信息</view>
			<view class="info-list">
				<view class="info-item">
					<text class="info-label">开放时间</text>
					<text class="info-value">{{ detail.openTime }}</text>
				</view>
				<view class="info-item">
					<text class="info-label">门票价格</text>
					<text class="info-value">{{ detail.price }}</text>
				</view>
			</view>
		</view>

		<!-- 交通信息 -->
		<view class="detail-section">
			<view class="section-title">交通信息</view>
			<view class="info-list">
				<view class="info-item">
					<text class="info-label">地址</text>
					<text class="info-value">{{ detail.address }}</text>
				</view>
				<view class="info-item">
					<text class="info-label">交通</text>
					<text class="info-value">{{ detail.traffic }}</text>
				</view>
			</view>
		</view>

		<!-- 预约按钮 -->
		<view class="bottom-bar">
			<view class="reservation-btn" @click="showReservationModal">立即预约</view>
		</view>

		<!-- 预约弹窗 -->
		<view class="modal-overlay" v-if="showModal" @click="hideModal">
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">预约 {{ detail.name }}</text>
					<text class="modal-close" @click="hideModal">×</text>
				</view>
				<view class="modal-body">
					<view class="form-item" :class="{ 'has-error': formErrors.phoneNumber }">
						<text class="form-label">手机号 *</text>
						<input 
							class="form-input" 
							v-model="reservationForm.phoneNumber" 
							placeholder="请输入手机号" 
							type="number" 
							maxlength="11"
							@input="validatePhoneNumber"
							@blur="validatePhoneNumber"
						/>
						<text class="error-text" v-if="formErrors.phoneNumber">{{ formErrors.phoneNumber }}</text>
					</view>
					<view class="form-item" :class="{ 'has-error': formErrors.name }">
						<text class="form-label">姓名 *</text>
						<input 
							class="form-input" 
							v-model="reservationForm.name" 
							placeholder="请输入姓名"
							@input="validateName"
							@blur="validateName"
						/>
						<text class="error-text" v-if="formErrors.name">{{ formErrors.name }}</text>
					</view>
					<view class="form-item" :class="{ 'has-error': formErrors.appointmentDate }">
						<text class="form-label">预约日期 *</text>
						<picker mode="date" :value="reservationForm.appointmentDate" @change="onDateChange" :start="minDate">
							<view class="picker-input" :class="{ 'picker-selected': reservationForm.appointmentDate }">{{ reservationForm.appointmentDate || '请选择预约日期' }}</view>
						</picker>
						<text class="error-text" v-if="formErrors.appointmentDate">{{ formErrors.appointmentDate }}</text>
					</view>
					<view class="form-item" :class="{ 'has-error': formErrors.appointmentTime }">
						<text class="form-label">预约时间 *</text>
						<picker mode="time" :value="reservationForm.appointmentTime" @change="onTimeChange">
							<view class="picker-input" :class="{ 'picker-selected': reservationForm.appointmentTime }">{{ reservationForm.appointmentTime || '请选择预约时间' }}</view>
						</picker>
						<text class="error-text" v-if="formErrors.appointmentTime">{{ formErrors.appointmentTime }}</text>
					</view>
					<view class="form-item">
						<text class="form-label">预约人数 *</text>
						<view class="counter">
							<text class="counter-btn" @click="decreaseCount" :class="{ 'disabled': reservationForm.visitorCount <= 1 }">-</text>
							<text class="counter-value">{{ reservationForm.visitorCount }}</text>
							<text class="counter-btn" @click="increaseCount" :class="{ 'disabled': reservationForm.visitorCount >= 10 }">+</text>
						</view>
						<text class="counter-tip">最少1人，最多10人</text>
					</view>
					<view class="form-item" :class="{ 'has-error': formErrors.notes }">
						<text class="form-label">备注</text>
						<textarea 
							class="form-textarea" 
							v-model="reservationForm.notes" 
							placeholder="请输入备注信息（可选）" 
							maxlength="200"
							@input="validatenotes"
						></textarea>
						<view class="textarea-footer">
							<text class="char-count">{{ reservationForm.notes.length }}/200</text>
						</view>
						<text class="error-text" v-if="formErrors.notes">{{ formErrors.remarks }}</text>
					</view>
				</view>
				<view class="modal-footer">
					<view class="btn-cancel" @click="hideModal">取消</view>
					<view class="btn-confirm" @click="submitReservation" :class="{ disabled: submitting }">{{ submitting ? '提交中...' : '确认预约' }}</view>
				</view>
			</view>
		</view>

		<!-- 预约状态弹窗 -->
		<view class="modal-overlay" v-if="showStatusModal" @click="hideStatusModal">
			<view class="status-modal" @click.stop>
				<view class="status-icon" :class="statusType">
					<text v-if="statusType === 'success'">✓</text>
					<text v-else-if="statusType === 'error'">✗</text>
					<text v-else>!</text>
				</view>
				<view class="status-title">{{ statusTitle }}</view>
				<view class="status-message">{{ statusMessage }}</view>
				<view class="status-btn" @click="hideStatusModal">确定</view>
			</view>
		</view>
	</view>
</template>

<script>
	import request from "../../../utils/request";

	export default {
		data() {
			return {
				detail: {},
				showModal: false,
				showStatusModal: false,
				submitting: false,
				statusType: 'success', // success, error, warning
				statusTitle: '',
				statusMessage: '',
				reservationForm: {
					phoneNumber: '',
					name: '',
					appointmentDate: '',
					appointmentTime: '',
					visitorCount: 1,
					notes: ''
				},
				formErrors: {
					phoneNumber: '',
					name: '',
					appointmentDate: '',
					appointmentTime: '',
					notes: ''
				}
			}
		},
		computed: {
			minDate() {
				const today = new Date()
				return today.toISOString().split('T')[0]
			}
		},
		onLoad(options) {
			const id = Number(options.id)
			request({
				url: '/tourism/type',
				method: 'GET',
				data: {
					type: 'scenic',
				}
			}).then(res => {
				// 获取景点详情
				// 将tags字段转换为数组，默认为 tags: '["xxs", "xxx"]'
				this.detail = res.data.data.find(item => item.id === id)
				this.detail.tags = JSON.parse(this.detail.tags)
			})
		},
		methods: {
			// 显示预约弹窗
			showReservationModal() {
				this.showModal = true
			},
			// 隐藏预约弹窗
			hideModal() {
				this.showModal = false
				this.resetForm()
				this.clearAllErrors()
			},
			// 隐藏状态弹窗
			hideStatusModal() {
				this.showStatusModal = false
			},
			// 日期选择
			onDateChange(e) {
				this.reservationForm.appointmentDate = e.detail.value
				this.validateAppointmentDate()
			},
			// 时间选择
			onTimeChange(e) {
				this.reservationForm.appointmentTime = e.detail.value
				this.validateAppointmentTime()
			},
			// 验证手机号
			validatePhoneNumber() {
				const phoneNumber = this.reservationForm.phoneNumber.trim()
				
				if (!phoneNumber) {
					this.formErrors.phoneNumber = '请输入手机号'
					return false
				}
				
				if (phoneNumber.length !== 11) {
					this.formErrors.phoneNumber = '手机号必须为11位数字'
					return false
				}
				
				// 更完整的手机号正则表达式，支持所有主流运营商号段
				// 移动：134-139, 147, 150-152, 157-159, 178, 182-184, 187-188, 198
				// 联通：130-132, 145, 155-156, 166, 175-176, 185-186
				// 电信：133, 149, 153, 173-174, 177, 180-181, 189, 191, 199
				// 虚拟运营商：170, 171
				const phoneRegex = /^1(3[0-9]|4[5-9]|5[0-35-9]|6[6]|7[0-8]|8[0-9]|9[1,8,9])\d{8}$/
				
				if (!phoneRegex.test(phoneNumber)) {
					this.formErrors.phoneNumber = '请输入正确的手机号格式'
					return false
				}
				
				this.formErrors.phoneNumber = ''
				return true
			},
			// 验证姓名
			validateName() {
				const name = this.reservationForm.name.trim()
				
				if (!name) {
					this.formErrors.name = '请输入姓名'
					return false
				}
				
				if (name.length < 2) {
					this.formErrors.name = '姓名至少需要2个字符'
					return false
				}
				
				if (name.length > 20) {
					this.formErrors.name = '姓名不能超过20个字符'
					return false
				}
				
				if (!/^[\u4e00-\u9fa5a-zA-Z\s]+$/.test(name)) {
					this.formErrors.name = '姓名只能包含中文、英文和空格'
					return false
				}
				
				this.formErrors.name = ''
				return true
			},
			// 验证预约日期
			validateAppointmentDate() {
				if (!this.reservationForm.appointmentDate) {
					this.formErrors.appointmentDate = '请选择预约日期'
					return false
				}
				
				const selectedDate = new Date(this.reservationForm.appointmentDate)
				const today = new Date()
				today.setHours(0, 0, 0, 0)
				
				if (selectedDate < today) {
					this.formErrors.appointmentDate = '不能选择过去的日期'
					return false
				}
				
				// 检查是否超过30天
				const maxDate = new Date()
				maxDate.setDate(maxDate.getDate() + 30)
				if (selectedDate > maxDate) {
					this.formErrors.appointmentDate = '预约日期不能超过30天'
					return false
				}
				
				this.formErrors.appointmentDate = ''
				return true
			},
			// 验证预约时间
			validateAppointmentTime() {
				if (!this.reservationForm.appointmentTime) {
					this.formErrors.appointmentTime = '请选择预约时间'
					return false
				}
				
				// 检查营业时间（假设8:00-18:00）
				const time = this.reservationForm.appointmentTime
				const [hours, minutes] = time.split(':').map(Number)
				const timeInMinutes = hours * 60 + minutes
				
				if (timeInMinutes < 8 * 60 || timeInMinutes > 18 * 60) {
					this.formErrors.appointmentTime = '预约时间请选择8:00-18:00之间'
					return false
				}
				
				this.formErrors.appointmentTime = ''
				return true
			},
			// 验证备注
			validatenotes() {
				if (this.reservationForm.notes.length > 200) {
					this.formErrors.notes = '备注不能超过200个字符'
					return false
				}
				
				this.formErrors.notes = ''
				return true
			},
			// 清除所有错误
			clearAllErrors() {
				this.formErrors = {
					phoneNumber: '',
					name: '',
					appointmentDate: '',
					appointmentTime: '',
					notes: ''
				}
			},
			// 增加人数
			increaseCount() {
				if (this.reservationForm.visitorCount < 10) {
					this.reservationForm.visitorCount++
				}
			},
			// 减少人数
			decreaseCount() {
				if (this.reservationForm.visitorCount > 1) {
					this.reservationForm.visitorCount--
				}
			},
			// 验证表单
			validateForm() {
				let isValid = true
				
				// 验证所有字段
				if (!this.validatePhoneNumber()) isValid = false
				if (!this.validateName()) isValid = false
				if (!this.validateAppointmentDate()) isValid = false
				if (!this.validateAppointmentTime()) isValid = false
				if (!this.validatenotes()) isValid = false
				
				if (!isValid) {
					this.showStatus('error', '验证失败', '请检查并修正表单中的错误信息')
				}
				
				return isValid
			},
			// 提交预约
			async submitReservation() {
				if (this.submitting) return
				
				if (!this.validateForm()) return
				
				this.submitting = true
				
				try {
					// 确保时间格式为HH:mm:ss
					const appointmentTime = this.reservationForm.appointmentTime.includes(':') 
						? (this.reservationForm.appointmentTime.split(':').length === 2 
							? this.reservationForm.appointmentTime + ':00' 
							: this.reservationForm.appointmentTime)
						: this.reservationForm.appointmentTime + ':00'
					
					const reservationData = {
						phoneNumber: this.reservationForm.phoneNumber,
						name: this.reservationForm.name,
						scenicId: this.detail.id,
						scenicName: this.detail.name,
						appointmentDate: this.reservationForm.appointmentDate,
						appointmentTime: appointmentTime,
						visitorCount: this.reservationForm.visitorCount,
						notes: this.reservationForm.notes
					}
					
					const res = await request({
						url: '/appointments',
						method: 'POST',
						data: reservationData
					})
					
					if (res.data.code === 200) {
						this.hideModal()
						this.showStatus('success', '预约成功', '您的预约已提交，请等待审核')
					} else {
						this.showStatus('error', '预约失败', res.data.msg || '预约提交失败，请稍后重试')
					}
				} catch (error) {
					console.error('预约提交失败:', error)
					this.showStatus('error', '预约失败', '网络错误，请稍后重试')
				} finally {
					this.submitting = false
				}
			},
			// 显示状态弹窗
			showStatus(type, title, message) {
				this.statusType = type
				this.statusTitle = title
				this.statusMessage = message
				this.showStatusModal = true
			},
			// 重置表单
			resetForm() {
				this.reservationForm = {
					phoneNumber: '',
					name: '',
					appointmentDate: '',
					appointmentTime: '',
					visitorCount: 1,
					notes: ''
				}
				this.clearAllErrors()
			}
		}
	}
</script>

<style>
	.container {
		background-color: #F5F5F5;
		min-height: 100vh;
		padding-bottom: 120rpx;
	}

	.swiper {
		width: 100%;
		height: 500rpx;
	}

	.swiper-image {
		width: 100%;
		height: 100%;
	}

	.info-section {
		background-color: #FFFFFF;
		padding: 30rpx;
		margin-bottom: 20rpx;
	}

	.title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 20rpx;
	}

	.tag {
		background-color: #F5F5F5;
		color: #666;
		font-size: 24rpx;
		padding: 8rpx 20rpx;
		border-radius: 24rpx;
		margin-right: 16rpx;
		margin-bottom: 16rpx;
	}

	.score-info {
		display: flex;
		align-items: center;
		font-size: 26rpx;
		color: #666;
	}

	.score {
		color: #FF9500;
		margin-right: 30rpx;
	}

	.visit-count {
		margin-right: 30rpx;
	}

	.detail-section {
		background-color: #FFFFFF;
		padding: 30rpx;
		margin-bottom: 20rpx;
	}

	.section-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
		display: flex;
		align-items: center;
	}

	.section-title::before {
		content: '';
		display: inline-block;
		width: 6rpx;
		height: 30rpx;
		background-color: #32C5FF;
		margin-right: 16rpx;
	}

	.detail-text {
		font-size: 28rpx;
		color: #666;
		line-height: 1.6;
	}

	.info-list {
		font-size: 28rpx;
	}

	.info-item {
		display: flex;
		margin-bottom: 16rpx;
	}

	.info-label {
		width: 140rpx;
		color: #999;
	}

	.info-value {
		flex: 1;
		color: #333;
	}

	.bottom-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #FFFFFF;
		padding: 20rpx 30rpx;
		box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
	}

	.reservation-btn {
		background-color: #32C5FF;
		color: #FFFFFF;
		font-size: 32rpx;
		text-align: center;
		padding: 24rpx 0;
		border-radius: 44rpx;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	.reservation-btn:active {
		background-color: #2BA3D4;
	}

	/* 弹窗样式 */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	.modal-content {
		background-color: #FFFFFF;
		border-radius: 20rpx;
		width: 90%;
		max-width: 600rpx;
		max-height: 80vh;
		overflow: hidden;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;
		border-bottom: 1rpx solid #F0F0F0;
	}

	.modal-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
	}

	.modal-close {
		font-size: 40rpx;
		color: #999;
		cursor: pointer;
	}

	.modal-body {
		padding: 30rpx;
		max-height: 60vh;
		overflow-y: auto;
	}

	.form-item {
		margin-bottom: 30rpx;
		position: relative;
	}

	.form-item.has-error .form-input,
	.form-item.has-error .picker-input {
		border-color: #FF4757;
	}

	.form-label {
		display: block;
		font-size: 28rpx;
		color: #333;
		margin-bottom: 16rpx;
		font-weight: 500;
	}

	.form-input {
		width: 100%;
		height: 80rpx;
		padding: 0 20rpx;
		border: 1rpx solid #E0E0E0;
		border-radius: 8rpx;
		font-size: 28rpx;
		box-sizing: border-box;
		transition: border-color 0.3s ease;
	}

	.form-input:focus {
		border-color: #32C5FF;
		outline: none;
	}

	.picker-input {
		height: 80rpx;
		padding: 0 20rpx;
		border: 1rpx solid #E0E0E0;
		border-radius: 8rpx;
		font-size: 28rpx;
		line-height: 80rpx;
		color: #999;
		background-color: #FFFFFF;
		transition: border-color 0.3s ease;
		cursor: pointer;
	}

	.picker-input.picker-selected {
		color: #333;
	}

	.error-text {
		display: block;
		font-size: 24rpx;
		color: #FF4757;
		margin-top: 8rpx;
		line-height: 1.4;
	}

	.counter {
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}

	.counter-btn {
		width: 60rpx;
		height: 60rpx;
		border: 1rpx solid #E0E0E0;
		border-radius: 8rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 32rpx;
		color: #666;
		background-color: #FFFFFF;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.counter-btn:active {
		background-color: #F5F5F5;
	}

	.counter-btn.disabled {
		color: #CCC;
		border-color: #F0F0F0;
		background-color: #F8F8F8;
		cursor: not-allowed;
	}

	.counter-tip {
		font-size: 24rpx;
		color: #999;
		margin-top: 8rpx;
		display: block;
	}

	.counter-value {
		margin: 0 30rpx;
		font-size: 28rpx;
		color: #333;
		min-width: 60rpx;
		text-align: center;
	}

	.form-textarea {
		width: 100%;
		height: 120rpx;
		padding: 20rpx;
		border: 1rpx solid #E0E0E0;
		border-radius: 8rpx;
		font-size: 28rpx;
		box-sizing: border-box;
		resize: none;
		transition: border-color 0.3s ease;
	}

	.form-textarea:focus {
		border-color: #32C5FF;
		outline: none;
	}

	.textarea-footer {
		display: flex;
		justify-content: flex-end;
		margin-top: 8rpx;
	}

	.char-count {
		font-size: 24rpx;
		color: #999;
	}

	.modal-footer {
		display: flex;
		padding: 30rpx;
		border-top: 1rpx solid #F0F0F0;
		gap: 20rpx;
	}

	.btn-cancel {
		flex: 1;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border: 1rpx solid #E0E0E0;
		border-radius: 8rpx;
		font-size: 28rpx;
		color: #666;
		background-color: #FFFFFF;
		cursor: pointer;
	}

	.btn-cancel:active {
		background-color: #F5F5F5;
	}

	.btn-confirm {
		flex: 1;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		background-color: #32C5FF;
		color: #FFFFFF;
		border-radius: 8rpx;
		font-size: 28rpx;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	.btn-confirm:active {
		background-color: #2BA3D4;
	}

	.btn-confirm.disabled {
		background-color: #CCC;
		color: #999;
		cursor: not-allowed;
	}

	.btn-confirm.disabled:active {
		background-color: #CCC;
	}

	/* 状态弹窗样式 */
	.status-modal {
		background-color: #FFFFFF;
		border-radius: 20rpx;
		width: 80%;
		max-width: 500rpx;
		padding: 60rpx 40rpx 40rpx;
		text-align: center;
	}

	.status-icon {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		margin: 0 auto 30rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 60rpx;
		font-weight: bold;
		color: #FFFFFF;
	}

	.status-icon.success {
		background-color: #52C41A;
	}

	.status-icon.error {
		background-color: #FF4D4F;
	}

	.status-icon.warning {
		background-color: #FAAD14;
	}

	.status-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 20rpx;
	}

	.status-message {
		font-size: 28rpx;
		color: #666;
		line-height: 1.5;
		margin-bottom: 40rpx;
	}

	.status-btn {
		width: 200rpx;
		height: 70rpx;
		line-height: 70rpx;
		background-color: #32C5FF;
		color: #FFFFFF;
		border-radius: 8rpx;
		font-size: 28rpx;
		margin: 0 auto;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	.status-btn:active {
		background-color: #2BA3D4;
	}
</style>