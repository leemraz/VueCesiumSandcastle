<template>
  <div id="cesiumContainer" class="fullSize"></div>
</template>
<script>
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
export default {
  name: 'Interior',
  mounted() {
    const viewer = new Cesium.Viewer('cesiumContainer')

    const tileset = new Cesium.Cesium3DTileset({
      url: Cesium.IonResource.fromAssetId(19365)
    })
    viewer.scene.primitives.add(tileset)

    const initialPosition = new Cesium.Cartesian3(
      -1111583.3721328347,
      -5855888.151574568,
      2262561.444696748
    )
    const initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(
      100.0,
      -15.0,
      0.0
    )
    viewer.scene.camera.setView({
      destination: initialPosition,
      orientation: initialOrientation,
      endTransform: Cesium.Matrix4.IDENTITY
    })
  }
}
</script>
<style lang="scss" scoped></style>
