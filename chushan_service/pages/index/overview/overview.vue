<template>
  <view class="container">
    <scroll-view scroll-y class="content">
      <view class="overview-text">
        位于
        <text class="highlight">厦门市翔安区内厝镇北部</text>
        ，
        是内厝镇唯一的
        <text class="highlight">高山村落</text>
        。
        集
        <text class="highlight">红色旅游</text>
        、
        <text class="highlight">田园游乐</text>
        为一体，
        乡村旅游度假目的地。
        这里有最原生态的乡野风貌，
        不仅是
        <text class="highlight">福建省国有企业爱国主义教育基地</text>
        ，
        <text class="highlight">福建省高级"绿盈乡村"</text>
        ，
        更具有田园诗意之美。
      </view>
    </scroll-view>
  </view>
</template>

<style scoped>
.container {
  background-color: #F8F8F8;
  min-height: 100vh;
}

.content {
  height: 100vh;
  padding: 40rpx;
}

.overview-text {
  font-size: 32rpx;
  color: #333;
  line-height: 2;
  text-align: center;
  margin-left: 10rpx;
  white-space: pre-line;
  word-break: break-all;
  max-width: 85%; /* 新增最大宽度限制 */
}
.highlight {
  font-weight: bold;
  color: #ff3232;
}
</style>