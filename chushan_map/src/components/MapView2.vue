<template>
  <tlbs-map
    ref="mapRef"
    api-key="AEEBZ-IFKK5-2XQIK-IJMFI-D37FH-NHBKM"
    :center="center"
    :zoom="zoom"
    :control="control"
    @click="onClick"
    @map_inited="onMapInited"
    :options="mapOptions"
    style="height: 100vh; width: 100%"
  >
    <tlbs-multi-marker
      ref="markerRef"
      :geometries="geometries"
      :styles="styles"
      :options="options"
    />
  </tlbs-map>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const mapRef = ref(null)
const markerRef = ref(null)
const center = ref({ lat: 24.715389, lng: 118.319189 })
const zoom = ref(20)

// 定义西南角和东北角的经纬度
const sw = new TMap.LatLng(24.712016, 118.315501);
const ne = new TMap.LatLng(24.719793, 118.324728);

// 创建 LatLngBounds 对象
const bounds = new TMap.LatLngBounds(sw, ne);

const mapOptions = ref({
  mapStyleId: 'style1',
  baseMap: { type: 'satellite' },
  boundary: bounds
})

const control = {
  scale: {},
  zoom: {
    position: 'topRight'
  }

}

const geometries = ref([
  {
    styleId: 'marker',
    position: { lat: 24.715389, lng: 118.319189 },
    content: '锄山公社',
    link: 'https://ed5gqynat.wasee.com/wt/ed5gqynat'
  },
  {
    styleId: 'marker',
    position: { lat: 24.715305, lng: 118.319189 },
    content: '锄山公社-门口',
    link: 'https://ed5hhmo4k.wasee.com/wt/ed5hhmo4k'
  },
  {
    styleId: 'marker', position: { lat: 24.715724, lng: 118.320839 }, link: 'https://ed5tz4fxm.wasee.com/wt/ed5tz4fxm',
    content: '党校'
  },
  {
    styleId: 'marker',
    position: { lat: 24.715676, lng: 118.320764 },
    link: 'https://ed5u0kepv.wasee.com/wt/ed5u0kepv',
    content: '党校门口'
  },
  {
    styleId: 'marker',
    position: { lat: 24.714623, lng: 118.320492 },
    link: 'https://ed50ukx55.wasee.com/wt/ed50ukx55',
    content: '露营烧烤区'
  },
  {
    styleId: 'marker',
    position: { lat: 24.713756, lng: 118.322990 },
    link: 'https://ed51sbh3z.wasee.com/wt/ed51sbh3z',
    content: '观光处'
  },
  {
    styleId: 'marker',
    position: { lat: 24.71571299738356, lng: 118.3208495378494 },
    content: '红色文化传承'
  },
  {
    styleId: 'marker',
    position: { lat: 24.71582504451679, lng: 118.3207637071609 },
    content: '创意手作'
  },
  {
    styleId: 'marker',
    position: { lat: 24.71516737511946, lng: 118.3199483156204 },
    content: '农学体验'
  },
  {
    styleId: 'marker',
    position: { lat: 24.71461200714473, lng: 118.3205437660217 },
    content: '自然教育'
  },
  {
    styleId: 'marker',
    position: { lat: 24.71659962846188, lng: 118.3209192752838 },
    content: '创业沙盘推演'
  },
  {
    styleId: 'marker',
    position: { lat: 24.7160052940412, lng: 118.3209729194641 },
    content: '风景画作'
  },
])

const styles = ref({
  marker: {
    width: 20,
    height: 30,
    anchor: { x: 10, y: 30 },
    offset: { x: 0, y: 40 }, // 标注点文本文
    color: '#fff',
    strokeColor: '#000',
  }
})

const options = ref({
  minZoom: 5,
  maxZoom: 30
})

const onClick = (e) => {
  // console.log(e)
}

const onMapInited = () => {
  console.log(mapRef.value.map)
  // console.log(markerRef.value);
  markerRef.value.marker.on('click', evt => {
    // console.log(evt)
    window.open(evt.geometry.link, '_blank')
  })
}

const getLayerInstance = () => {
  console.log(markerRef.value.marker)
}

onMounted(() => {
})
</script>