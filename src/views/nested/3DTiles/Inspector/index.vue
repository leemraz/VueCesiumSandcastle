<template>
  <div id="cesiumContainer"></div>
</template>

<script>
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'

export default {
  name: 'Dashboard',
  mounted() {
    // Building data courtesy of NYC OpenData portal: http://www1.nyc.gov/site/doitt/initiatives/3d-building.page
    var viewer = new Cesium.Viewer('cesiumContainer', {
      terrainProvider: Cesium.createWorldTerrain()
    })
    viewer.scene.logarithmicDepthBuffer = false
    viewer.scene.globe.depthTestAgainstTerrain = true

    viewer.extend(Cesium.viewerCesium3DTilesInspectorMixin)
    var inspectorViewModel = viewer.cesium3DTilesInspector.viewModel

    var tileset = new Cesium.Cesium3DTileset({
      url: Cesium.IonResource.fromAssetId(75343)
    })
    viewer.scene.primitives.add(tileset)

    tileset.readyPromise.then(function() {
      viewer.zoomTo(
        tileset,
        new Cesium.HeadingPitchRange(
          0.0,
          -0.5,
          tileset.boundingSphere.radius / 4.0
        )
      )
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
