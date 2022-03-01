<template>
  <div id="cesiumContainer" class="fullSize"></div>
</template>
<script>
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
export default {
  name: 'ClampTo3DTiles',
  mounted() {
    const viewer = new Cesium.Viewer('cesiumContainer', {
      terrainProvider: new Cesium.createWorldTerrain()
    })
    const scene = viewer.scene
    const clock = viewer.clock
    let entity, positionProperty

    const dataSourcePromise = Cesium.CzmlDataSource.load(
      './static/SampleData/ClampToGround.czml'
    )
    viewer.dataSources.add(dataSourcePromise).then(dataSource => {
      entity = dataSource.entities.getById('CesiumMilkTruck')
      positionProperty = entity.position
    })

    const tileset = scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url: Cesium.IonResource.fromAssetId(40866)
      })
    )

    viewer.camera.setView({
      destination: new Cesium.Cartesian3(
        1216403.8845586285,
        -4736357.493351395,
        4081299.715698949
      ),
      orientation: new Cesium.HeadingPitchRoll(
        4.2892217081808806,
        -0.4799070147502502,
        6.279789177843313
      ),
      endTransform: Cesium.Matrix4.IDENTITY
    })

    if (scene.clampToHeightSupported) {
      tileset.initialTilesLoaded.addEventListener(start)
    } else {
      window.alert('This browser does not support clampToHeight.')
    }
    function start() {
      clock.shouldAnimate = true
      var objectsToExclude = [entity]
      scene.postRender.addEventListener(function() {
        var position = positionProperty.getValue(clock.currentTime)
        entity.position = scene.clampToHeight(position, objectsToExclude)
      })
    }
  }
}
</script>
<style lang="scss" scoped></style>
