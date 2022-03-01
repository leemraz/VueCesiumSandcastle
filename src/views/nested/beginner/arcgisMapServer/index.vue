<!--  -->
<template>
  <div id="cesiumContainer" class="fullSize" />
</template>

<script>
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
export default {
  name: 'MapServer',
  data() {
    return {}
  },
  // 生命周期 - 创建完成（访问当前this实例）
  created() {},
  // 生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    const viewer = new Cesium.Viewer('cesiumContainer', {
      terrainProvider: new Cesium.createWorldTerrain()
    })
    viewer.imageryLayers.addImageryProvider(
      new Cesium.ArcGisMapServerImageryProvider({
        url:
          'https://nationalmap.gov.au/proxy/http://services.ga.gov.au/site_3/rest/services/Electricity_Infrastructure/MapServer'
      })
    )
    viewer.camera.setView({
      destination: Cesium.Rectangle.fromDegrees(114.591, -45.837, 148.97, -5.73)
    })
  }
}
</script>
<style scoped>
/* @import url(); 引入css类 */
/* @import url('cesium/Build/Cesium/Widgets/widgets.css'); */
</style>
