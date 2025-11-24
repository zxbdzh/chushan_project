<template>
  <view class="container">
    <!-- 搜索框 -->
    <view class="search-box">
      <text class="iconfont icon-search"></text>
      <input type="text" placeholder="搜索" v-model="searchText" />
    </view>

    <!-- 分类标签 -->
    <scroll-view class="category-tabs" scroll-x>
      <view v-for="(tab, index) in tabs" :key="index" class="tab-item" :class="{ active: currentTab === index }"
        @tap="switchTab(index)">
        {{ tab }}
      </view>
    </scroll-view>

    <!-- 攻略列表 -->
    <scroll-view class="guide-list" scroll-y>
      <view class="guide-grid">
        <view v-for="(item, index) in guideItems" :key="index" class="guide-item" @tap="goToDetail(item)">
          <view class="image-container">
            <image :src="item.imageUrl" mode="aspectFill" class="item-image"></image>
            <view class="view-count">
              <text class="iconfont icon-eye"></text>
              <text>{{ item.views }}</text>
            </view>
          </view>
          <view class="item-info">
            <view class="item-title">
              <text class="iconfont icon-location"></text>
              <text>{{ item.title }}</text>
            </view>
            <text class="item-desc">{{ item.description }}</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  onLoad() {
    uni.setNavigationBarTitle({
      title: '攻略'
    })
  }
}
</script>

<script setup>
import { ref, onMounted, watch } from 'vue'
import request from '../../utils/request'

const searchText = ref('')
const currentTab = ref(0)
const tabs = ['全部', '线路', '吃喝', '住宿', '购物', '其他']
const allData = ref(null)

const guideItems = ref(null)

const switchTab = (index) => {
  currentTab.value = index
  if (currentTab.value === 0) {
    // 如果是"全部"标签，显示所有数据
    guideItems.value = allData.value
  } else {
    // 根据当前选中的标签过滤数据
    guideItems.value = allData.value.filter(item => {
      return item.type === tabs[currentTab.value]
    })
  }
}

const goToDetail = (item) => {
  uni.navigateTo({
    url: `/pages/guide-detail/guide-detail?title=${item.title}`
  })
}

const getGuideItems = async () => {
  await request({
    url: '/guideItems',
    method: 'GET',
  }).then(res => {
    guideItems.value = res.data.data
    allData.value = res.data.data
  })
}

// 监听搜索文本变化，过滤攻略列表
watch(searchText, (newVal) => {
  if (currentTab.value === 0) {
    // 在全部标签下搜索
    guideItems.value = allData.value.filter(item => {
      return item.title.toLowerCase().includes(newVal.toLowerCase()) ||
        item.description.toLowerCase().includes(newVal.toLowerCase())
    })
  } else {
    // 在特定分类下搜索
    guideItems.value = allData.value.filter(item => {
      return (item.type === tabs[currentTab.value]) &&
        (item.title.toLowerCase().includes(newVal.toLowerCase()) ||
          item.description.toLowerCase().includes(newVal.toLowerCase()))
    })
  }
})


onMounted(() => {
  getGuideItems()
})
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.search-box {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 8rpx;
  padding: 16rpx 24rpx;
  margin: 20rpx;
}

.search-box .icon-search {
  margin-right: 10rpx;
  color: #999;
}

.search-box input {
  flex: 1;
  font-size: 28rpx;
}

.category-tabs {
  display: flex;
  white-space: nowrap;
  background-color: #fff;
  padding: 0 20rpx;
  border-bottom: 1px solid #eee;
}

.tab-item {
  display: inline-block;
  padding: 20rpx 32rpx;
  font-size: 28rpx;
  color: #666;
  position: relative;
}

.tab-item.active {
  color: #00C853;
  font-weight: bold;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 4rpx;
  background-color: #00C853;
  border-radius: 2rpx;
}

.guide-list {
  flex: 1;
  padding: 20rpx;
}

.guide-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.guide-item {
  background-color: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.image-container {
  position: relative;
  width: 100%;
  padding-top: 100%;
  /* 1:1 Aspect Ratio */
}

.item-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.view-count {
  position: absolute;
  right: 16rpx;
  bottom: 16rpx;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 30rpx;
  padding: 4rpx 12rpx;
  display: flex;
  align-items: center;
  gap: 4rpx;
  color: #fff;
  font-size: 24rpx;
}

.view-count .icon-eye {
  font-size: 24rpx;
}

.item-info {
  padding: 16rpx;
}

.item-title {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 8rpx;
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.item-title .icon-location {
  color: #666;
  font-size: 24rpx;
}

.item-desc {
  font-size: 24rpx;
  color: #666;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
