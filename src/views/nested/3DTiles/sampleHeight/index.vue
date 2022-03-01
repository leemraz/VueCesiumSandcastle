<template>
  <div>
    <div id="cesiumContainer" class="fullSize">
      <div class="btn-nav">
        <div class="btn-height">
          <el-button type="primary" plain @click="onSubmit">高度采样</el-button>
        </div>
        <div class="btn-view">
          <el-button type="primary" plain @click="onFlyTo">返回视图</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
export default {
  name: 'SampleHeight',
  mounted() {
    const viewer = new Cesium.Viewer('cesiumContainer', {
      terrainProvider: Cesium.createWorldTerrain()
    })
    const scene = viewer.scene
    if (!scene.clampToHeightSupported) {
      window.alert('This browser does not support clampToHeightMostDetailed.')
    }
    const tileset = scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url: Cesium.IonResource.fromAssetId(40866)
      })
    )

    this.flyToScene = () => {
      //   scene.camera.setView({
      //     destination: new Cesium.Cartesian3(
      //       1216411.0748779264,
      //       -4736313.10747583,
      //       4081359.5125561724
      //     ),
      //     orientation: new Cesium.HeadingPitchRoll(
      //       4.239925103568368,
      //       -0.4911293834802475,
      //       6.279849292088564
      //     ),
      //     endTransform: Cesium.Matrix4.IDENTITY
      //   })
      viewer.camera.flyTo({
        destination: new Cesium.Cartesian3(
          1216411.0748779264,
          -4736313.10747583,
          4081359.5125561724
        ),
        orientation: new Cesium.HeadingPitchRoll(
          4.239925103568368,
          -0.4911293834802475,
          6.279849292088564
        )
      })
    }
    this.flyToScene()
    tileset.allTilesLoaded.addEventListener(() => {
      console.log('3d tiles 数据加载完毕')
    })
    this.sampleHeights = () => {
      viewer.entities.removeAll()
      const cartesian1 = new Cesium.Cartesian3(
        1216390.063324395,
        -4736314.814479433,
        4081341.9787972216
      )
      const cartesian2 = new Cesium.Cartesian3(
        1216329.5413318684,
        -4736272.029009798,
        4081407.9342479417
      )
      const count = 30
      const cartesians = new Array(count)
      for (let i = 0; i < count; ++i) {
        const offset = i / (count - 1)
        cartesians[i] = Cesium.Cartesian3.lerp(
          cartesian1,
          cartesian2,
          offset,
          new Cesium.Cartesian3()
        )
      }
      scene.clampToHeightMostDetailed(cartesians).then(clampedCartesians => {
        for (let i = 0; i < count; i++) {
          viewer.entities.add({
            position: clampedCartesians[i],
            ellipsoid: {
              radii: new Cesium.Cartesian3(0.2, 0.2, 0.2),
              material: Cesium.Color.RED
            }
          })
        }
        viewer.entities.add({
          polyline: {
            positions: clampedCartesians,
            arcType: Cesium.ArcType.NONE,
            width: 2,
            material: new Cesium.PolylineOutlineMaterialProperty({
              color: Cesium.Color.YELLOW
            }),
            depthFailMaterial: new Cesium.PolylineOutlineMaterialProperty({
              color: Cesium.Color.YELLOW
            })
          }
        })
      })
    }
  },
  methods: {
    onSubmit() {
      this.sampleHeights()
      this.$message({
        message: '操作成功，处理中',
        type: 'success'
      })
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
    onFlyTo() {
      this.flyToScene()
    }
  }
}
</script>
<style scoped>
.fullSize {
  position: relative;
}
.btn-nav {
  position: absolute;
  z-index: 1;
  top: 20px;
  left: 20px;
}
.btn-height {
  position: relative;
}
.btn-view {
  position: relative;
  top: 20px;
}
</style>
