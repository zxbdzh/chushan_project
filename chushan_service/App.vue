<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	page {
		background-color: #F5F5F5;
	}

	.search-icon {
		width: 32rpx;
		height: 32rpx;
		margin-right: 10rpx;
	}

	.search-box {
		display: flex;
		align-items: center;
		background-color: #F5F5F5;
		padding: 16rpx 30rpx;
		border-radius: 36rpx;
	}

	.search-box input {
		flex: 1;
		font-size: 28rpx;
		color: #333;
	}
</style>
