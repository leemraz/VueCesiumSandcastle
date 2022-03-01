<template>
  <div>
    <div id="cesiumContainer" class="fullSize"></div>
  </div>
</template>
<script>
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
export default {
  name: 'TerrianClassification',
  mounted() {
    const viewer = new Cesium.Viewer('cesiumContainer', {
      terrainProvider: Cesium.createWorldTerrain()
    })
    const geocoder = viewer.geocoder.viewModel
    geocoder.searchText = 'Vienna'
    geocoder.search()
    // 3D Tiles 的矢量格式正在实验，其格式将来可能发生改变
    // 关注开源地址：https://github.com/CesiumGS/3d-tiles/tree/3d-tiles-next/TileFormats/VectorData
    const tileSet = new Cesium.Cesium3DTileset({
      url: Cesium.IonResource.fromAssetId(5737)
    })
    viewer.scene.primitives.add(tileSet)
    tileSet.style = new Cesium.Cesium3DTileStyle({
      color: 'rgba(255, 255, 255, 0.5)'
    })
    // 当前高亮属性信息
    const highlighted = {
      feature: undefined,
      originalColor: new Cesium.Color()
    }
    // 悬浮要素变成黄色
    viewer.screenSpaceEventHandler.setInputAction(movement => {
      // 如果之前高亮过，则撤销原来的高亮
      if (Cesium.defined(highlighted.feature)) {
        highlighted.feature.color = highlighted.originalColor
        highlighted.feature = undefined
      }
      // 选取一个要素
      const pickedFeature = viewer.scene.pick(movement.endPosition)
      if (!Cesium.defined(pickedFeature)) {
        return
      }
      // 高亮选中的要素
      highlighted.feature = pickedFeature
      Cesium.Color.clone(pickedFeature.color, highlighted.originalColor)
      pickedFeature.color = Cesium.Color.YELLOW
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  }
}
</script>
<style scoped>
#toolbar {
  background: rgba(42, 42, 42, 0.8);
  padding: 4px;
  border-radius: 4px;
}
#toolbar input {
  vertical-align: middle;
  padding-top: 2px;
  padding-bottom: 2px;
}
#toolbar .header {
  font-weight: bold;
}
</style>
