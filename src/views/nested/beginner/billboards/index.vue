<!-- Cesium 广告牌示例 -->
<template>
  <div>
    <div id="mapContainer" class="fullSize">
      <el-select
        v-model="currentItem"
        value-key="text"
        clearable
        placeholder="请选择"
        @change="changeItem"
      >
        <el-option
          v-for="item in selectContent"
          :key="item.text"
          :label="item.text"
          :value="item"
        />
      </el-select>
    </div>
  </div>
</template>

<script>
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import Cesium_Logo_overlay from '@/assets/images/Cesium_Logo_overlay.png'
// import Cesium_Logo_overlay from './static/images/Cesium_Logo_overlay.png'
import facility from '@/assets/images/facility.gif'
import whiteShapes from '@/assets/images/whiteShapes.png'
export default {
  data() {
    return {
      currentItem: '',
      selectContent: [
        {
          text: 'Add billboard'
        },
        {
          text: 'Set billboard properties at creation'
        },
        {
          text: 'Change billboard properties'
        },
        {
          text: 'Size billboard in meters'
        },
        {
          text: 'Add multiple billboards'
        },
        {
          text: 'Scale by viewer distance'
        },
        {
          text: 'Fade by viewer distance'
        },
        {
          text: 'Offset by viewer distance'
        },
        {
          text: 'Add marker billboards'
        },
        {
          text: 'Disable the depth test when clamped to ground'
        }
      ]
    }
  },
  // 生命周期 - 创建完成（访问当前this实例）
  created() {},
  // 生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    const viewer = new Cesium.Viewer('mapContainer')
    viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
      billboard: {
        image: Cesium_Logo_overlay
        // image: './static/images/Cesium_Logo_overlay.png'
      }
    })
    const addBillboard = () => {
      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
        billboard: {
          billboard: {
            image: Cesium_Logo_overlay, // default: undefined
            show: true, // default
            pixelOffset: new Cesium.Cartesian2(0, -50), // default: (0, 0)
            eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0), // default
            horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // default
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // default: CENTER
            scale: 2.0, // default: 1.0
            color: Cesium.Color.LIME, // default: WHITE
            rotation: Cesium.Math.PI_OVER_FOUR, // default: 0.0
            alignedAxis: Cesium.Cartesian3.ZERO, // default
            width: 100, // default: undefined
            height: 25 // default: undefined
          }
        }
      })
    }
    const setBillboardProperties = () => {
      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
        billboard: {
          image: Cesium_Logo_overlay, // default: undefined
          show: true, // default
          pixelOffset: new Cesium.Cartesian2(0, -50), // default: (0, 0)
          eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0), // default
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // default
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // default: CENTER
          scale: 2.0, // default: 1.0
          color: Cesium.Color.LIME, // default: WHITE
          rotation: Cesium.Math.PI_OVER_FOUR, // default: 0.0
          alignedAxis: Cesium.Cartesian3.ZERO, // default
          width: 100, // default: undefined
          height: 25 // default: undefined
        }
      })
    }
    const changeBillboardProperties = () => {
      var entity = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883, 300000.0),
        billboard: {
          image: Cesium_Logo_overlay
        }
      })

      var billboard = entity.billboard
      billboard.scale = 3.0
      billboard.color = Cesium.Color.WHITE.withAlpha(0.25)
    }

    const sizeBillboardInMeters = () => {
      var entity = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
        billboard: {
          image: Cesium_Logo_overlay,
          sizeInMeters: true
        }
      })

      viewer.zoomTo(entity)
    }

    const addMultipleBillboards = () => {
      var logoUrl = Cesium_Logo_overlay
      var facilityUrl = facility

      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
        billboard: {
          image: logoUrl
        }
      })
      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-80.5, 35.14),
        billboard: {
          image: facilityUrl
        }
      })
      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-80.12, 25.46),
        billboard: {
          image: facilityUrl
        }
      })
    }

    const scaleByDistance = () => {
      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
        billboard: {
          image: facility,
          scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5)
        }
      })
    }

    const fadeByDistance = () => {
      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
        billboard: {
          image: Cesium_Logo_overlay,
          translucencyByDistance: new Cesium.NearFarScalar(
            1.5e2,
            2.0,
            1.5e7,
            0.5
          )
        }
      })
    }

    const offsetByDistance = () => {
      Cesium.when.all(
        [
          Cesium.Resource.fetchImage(Cesium_Logo_overlay),
          Cesium.Resource.fetchImage(facility)
        ],
        function(images) {
          // As viewer zooms closer to facility billboard,
          // increase pixelOffset on CesiumLogo billboard to this height
          var facilityHeight = images[1].height

          // colocated billboards, separate as viewer gets closer
          viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
            billboard: {
              image: images[1],
              horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM
            }
          })
          viewer.entities.add({
            position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
            billboard: {
              image: images[0],
              horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              pixelOffset: new Cesium.Cartesian2(0.0, -facilityHeight),
              pixelOffsetScaleByDistance: new Cesium.NearFarScalar(
                1.0e3,
                1.0,
                1.5e6,
                0.0
              ),
              translucencyByDistance: new Cesium.NearFarScalar(
                1.0e3,
                1.0,
                1.5e6,
                0.1
              )
            }
          })
        }
      )
    }

    const addMarkerBillboards = () => {
      // Add several billboards based on the above image in the atlas.
      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
        billboard: {
          image: whiteShapes,
          imageSubRegion: new Cesium.BoundingRectangle(49, 43, 18, 18),
          color: Cesium.Color.LIME
        }
      })
      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-84.0, 39.0),
        billboard: {
          image: whiteShapes,
          imageSubRegion: new Cesium.BoundingRectangle(61, 23, 18, 18),
          color: new Cesium.Color(0, 0.5, 1.0, 1.0)
        }
      })
      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-70.0, 41.0),
        billboard: {
          image: whiteShapes,
          imageSubRegion: new Cesium.BoundingRectangle(67, 80, 14, 14),
          color: new Cesium.Color(0.5, 0.9, 1.0, 1.0)
        }
      })
      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-73.0, 37.0),
        billboard: {
          image: whiteShapes,
          imageSubRegion: new Cesium.BoundingRectangle(27, 103, 22, 22),
          color: Cesium.Color.RED
        }
      })
      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-79.0, 35.0),
        billboard: {
          image: whiteShapes,
          imageSubRegion: new Cesium.BoundingRectangle(105, 105, 18, 18),
          color: Cesium.Color.YELLOW
        }
      })
    }

    let terrainProvider
    const disableDepthTest = () => {
      terrainProvider = viewer.terrainProvider
      viewer.terrainProvider = Cesium.createWorldTerrain()
      viewer.scene.globe.depthTestAgainstTerrain = true

      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(-122.1958, 46.1915),
        billboard: {
          image: facility,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        }
      })
      viewer.zoomTo(viewer.entities)
    }

    // eslint-disable-next-line no-unused-vars
    const reset = () => {
      viewer.camera.flyHome(0)
      viewer.entities.removeAll()

      if (Cesium.defined(terrainProvider)) {
        viewer.terrainProvider = terrainProvider
        terrainProvider = undefined
        viewer.scene.globe.depthTestAgainstTerrain = false
      }
    }
    this.changeSelect = item => {
      viewer.entities.removeAll()
      switch (item.text) {
        case 'Add billboard':
          addBillboard()
          break
        case 'Set billboard properties at creation':
          setBillboardProperties()
          break
        case 'Change billboard properties':
          changeBillboardProperties()
          break
        case 'Size billboard in meters':
          sizeBillboardInMeters()
          break
        case 'Add multiple billboards':
          addMultipleBillboards()
          break
        case 'Scale by viewer distance':
          scaleByDistance()
          break
        case 'Fade by viewer distance':
          fadeByDistance()
          break
        case 'Offset by viewer distance':
          offsetByDistance()
          break
        case 'Add marker billboards':
          addMarkerBillboards()
          break
        case 'Disable the depth test when clamped to ground':
          disableDepthTest()
          break
        default:
          addBillboard()
          break
      }
    }
  },
  methods: {
    changeItem(item) {
      this.changeSelect(item)
    }
  }
}
</script>
<style lang="scss" scoped>
.el-select {
  position: absolute;
  z-index: 1;
  margin: 20px;
}
</style>
