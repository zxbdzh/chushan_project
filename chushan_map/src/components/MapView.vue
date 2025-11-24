<script setup>
import { ref, onMounted } from 'vue'
import markers from '../config/markers.json'

const markerList = ref(markers.markers)
const scale = ref(1)
const minScale = 1
const maxScale = 1.8
const scaleStep = 0.1

const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)
const offsetX = ref(0)
const offsetY = ref(0)

// 在script部分新增计算边界的函数
const calculateBoundaries = () => {
  const mapEl = document.querySelector('.map')
  const containerWidth = mapEl.parentElement.clientWidth
  const containerHeight = mapEl.parentElement.clientHeight

  // 计算缩放后的图片实际尺寸
  const imgWidth = mapEl.scrollWidth * scale.value
  const imgHeight = mapEl.scrollHeight * scale.value

  // 计算最大可移动范围
  const maxX = Math.max(0, (imgWidth - containerWidth) / 2)
  const maxY = Math.max(0, (imgHeight - containerHeight) / 2)

  return {
    minX: -maxX,
    maxX,
    minY: -maxY,
    maxY
  }
}


const handleMarkerClick = (link) => {
  event.currentTarget.classList.add('active')
  setTimeout(() => {
    event.currentTarget.classList.remove('active')
  }, 500)
  window.open(link, '_blank')
}

const handleWheel = (e) => {
  e.preventDefault()
  const delta = e.deltaY > 0 ? -scaleStep : scaleStep
  const newScale = Math.max(minScale, Math.min(maxScale, scale.value + delta))

  // 计算缩放前的边界
  const prevBoundaries = calculateBoundaries()

  scale.value = newScale

  // 调整偏移量保持位置
  const newBoundaries = calculateBoundaries()
  offsetX.value = Math.max(newBoundaries.minX, Math.min(newBoundaries.maxX, offsetX.value))
  offsetY.value = Math.max(newBoundaries.minY, Math.min(newBoundaries.maxY, offsetY.value))

}

const handleMouseDown = (e) => {
  isDragging.value = true
  startX.value = e.clientX - offsetX.value
  startY.value = e.clientY - offsetY.value
}

const handleMouseMove = (e) => {
  if (!isDragging.value) return

  const boundaries = calculateBoundaries()
  const newX = e.clientX - startX.value
  const newY = e.clientY - startY.value

  offsetX.value = Math.max(boundaries.minX, Math.min(boundaries.maxX, newX))
  offsetY.value = Math.max(boundaries.minY, Math.min(boundaries.maxY, newY))

}

const handleMouseUp = () => {
  isDragging.value = false
}

onMounted(() => {
  const img = new Image()
  img.src = '@/assets/map.png'
  img.onload = () => {
    // 初始化边界计算
    offsetX.value = 0
    offsetY.value = 0
  }
  const mapEl = document.querySelector('.map')
  mapEl.addEventListener('wheel', handleWheel, { passive: false })
  mapEl.addEventListener('mousedown', handleMouseDown)
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
})
</script>

<template>
  <div class="map-container">
    <div
      class="map"
      :style="{ transform: `scale(${scale}) translate(${offsetX}px, ${offsetY}px)` }"
    >
      <div
        v-for="marker in markerList"
        :key="marker.id"
        class="marker"
        :style="{ left: marker.x + 'px', top: marker.y + 'px' }"
        @click="handleMarkerClick(marker.link)"
      >
        <div class="ripple"></div>
        <div class="marker-dot"></div>
        <div class="marker-name">{{ marker.name }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.map-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
  position: relative;
  overflow: hidden;
}

.map-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/map.png');
  background-size: cover;
  background-position: center;
  filter: blur(15px) brightness(0.8); /* 更强烈的模糊和暗化 */
  transform: scale(1.05); /* 防止边缘留白 */
  z-index: 0;
}


.map {
  width: 100%; /* 根据实际图片尺寸调整 */
  height: 100%;
  background-image: url('@/assets/map.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  display: inline-block;
  transform-origin: center;
  transition: transform 0.1s ease-out;
  user-select: none;
  cursor: grab;
}

.map:active {
  cursor: grabbing;
}

.marker {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
}

.marker-dot {
  width: 12px;
  height: 12px;
  background-color: #ff4444;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
}

.marker-name {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  margin-top: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.marker:hover .marker-name {
  opacity: 1;
}

.marker-inner {
  position: relative;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ripple {
  position: absolute;
  width: 24px;
  height: 24px;
  left: -5px;
  top: -5px;
  border-radius: 50%;
  background: rgba(255, 68, 68, 0.4);
  animation: ripple 1s infinite;
  pointer-events: none;
}

@keyframes ripple {
  0% {
    transform: scale(0.5);
    opacity: 1;
  }
  100% {
    transform: scale(5);
    opacity: 0;
  }
}

/* 调整原有marker-dot尺寸 */
.marker-dot {
  width: 14px;
  height: 14px;
  /* 其他原有样式保持不变 */
}

.ripple.active {
  animation: click-ripple 0.5s ease-out;
}

@keyframes click-ripple {
  from {
    transform: scale(0.8);
    opacity: 0.8;
  }
  to {
    transform: scale(2.5);
    opacity: 0;
  }
}
</style>
