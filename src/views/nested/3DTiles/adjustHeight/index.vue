<template>
  <div>
    <div id="cesiumContainer" class="fullSize">
      <el-slider
        v-model="rangeValue"
        show-input
        class="slider-height"
        :min="minValue"
        :max="maxValue"
        @input="changeRange"
      />
      <div class="coord-bar">
        <div>
          <font>经度：<span>{{ lngValue }}</span></font>
        </div>
        <div>
          <font>纬度：<span>{{ latValue }}</span></font>
        </div>
        <div>
          <font>视角高：<span>{{ altValue }}</span>km</font>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
export default {
  name: 'AdjustHeight',
  data() {
    return {
      rangeValue: 100,
      minValue: -100,
      maxValue: 500,
      lngValue: null,
      latValue: null,
      altValue: null,
      entities: [],
      annotations: new Cesium.LabelCollection()
      //   lngValue: 'loading',
      //   latValue: 'loading',
      //   altValue: 'loading '
    }
  },
  mounted() {
    const viewer = new Cesium.Viewer('cesiumContainer', {
      terrainProvider: Cesium.createWorldTerrain(),
      shadows: false
    })
    viewer.scene.globe.depthTestAgainstTerrain = true
    viewer._cesiumWidget._creditContainer.style.display = 'none'
    const tileset = new Cesium.Cesium3DTileset({
      url: './static/SampleData/Cesium3DTiles/Tilesets/Tileset/tileset.json'
    })
    viewer.scene.primitives.add(this.annotations)
    const handler = viewer.screenSpaceEventHandler
    const that = this
    tileset.readyPromise
      .then(tileset => {
        viewer.scene.primitives.add(tileset)
        tileset.style = new Cesium.Cesium3DTileStyle({
          color: {
            conditions: [
              ['${Height} >= 100', 'color("purple", 0.5)'],
              ['${Height} >= 50', 'color("red")'],
              ['true', 'color("blue")']
            ]
          },
          show: '${Height} > 0',
          meta: {
            description: '"Building id ${id} has height ${Height}."'
          }
        })
        viewer.zoomTo(
          tileset,
          new Cesium.HeadingPitchRange(
            0.0,
            -0.5,
            tileset.boundingSphere.radius * 2.0
          )
        )
        // 当前高亮属性信息
        const highlighted = {
          feature: undefined,
          originalColor: new Cesium.Color()
        }
        // todo：在椭球下点击创建点
        handler.setInputAction(movement => {
          const cartesian = viewer.camera.pickEllipsoid(
            movement.endPosition,
            viewer.scene.globe.ellipsoid
          )
          if (cartesian) {
            const cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(
              cartesian
            )
            that.lngValue = Cesium.Math.toDegrees(
              cartographic.longitude
            ).toFixed(4)
            that.latValue = Cesium.Math.toDegrees(
              cartographic.latitude
            ).toFixed(4)
            that.altValue = (
              viewer.camera.positionCartographic.height / 1000
            ).toFixed(2)
          }
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

        // todo：在显示地形情况下点击创建点
        handler.setInputAction(function(event) {
          if (!Cesium.Entity.supportsPolylinesOnTerrain(viewer.scene)) {
            console.log('当前浏览器不支持地形图')
            return
          }
          const earthPosition = viewer.scene.pickPosition(event.position) // 获取到地形图上面的坐标
          if (Cesium.defined(earthPosition)) {
            createPoint(earthPosition) // 调用创建点的方法
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
        // todo：拾取模型表面的位置
        handler.setInputAction(function(evt) {
          const scene = viewer.scene
          const pickedObject = scene.pick(evt.position) // 判断是否拾取到模型
          if (scene.pickPositionSupported && Cesium.defined(pickedObject)) {
            const cartesian = viewer.scene.pickPosition(evt.position)
            if (Cesium.defined(cartesian)) {
              const cartographic = Cesium.Cartographic.fromCartesian(cartesian) // 根据笛卡尔坐标获取到弧度
              const lng = Cesium.Math.toDegrees(cartographic.longitude) // 根据弧度获取到经度
              const lat = Cesium.Math.toDegrees(cartographic.latitude) // 根据弧度获取到纬度
              const height = cartographic.height // 模型高度
              annotate(cartesian, lng, lat, height)
            }
          }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

        handler.setInputAction(() => {
          if (viewer.entities._entities.length !== 0) {
            viewer.entities.removeAll()
          }
          if (that.annotations) {
            viewer.scene.primitives.remove(that.annotations)
            that.annotations = new Cesium.LabelCollection()
            viewer.scene.primitives.add(that.annotations)
          }
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)

        // 信息提示框
        function annotate(cartesian, lng, lat, height) {
          createPoint(cartesian)
          that.annotations.add({
            position: cartesian,
            text:
              'Lon: ' +
              lng.toFixed(5) +
              '\u00B0' +
              '\nLat: ' +
              lat.toFixed(5) +
              '\u00B0' +
              '\nheight: ' +
              height.toFixed(2) +
              'm',
            showBackground: true,
            font: '14px monospace',
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          })
        }

        // 添加点
        function createPoint(worldPosition) {
          const point = viewer.entities.add({
            position: worldPosition,
            point: {
              color: Cesium.Color.WHITE,
              pixelSize: 5
            }
          })
          return point
        }
      })
      .otherwise(function(error) {
        console.log(error)
      })
    const translateionModel = (tileset, height) => {
      const cartographic = Cesium.Cartographic.fromCartesian(
        tileset.boundingSphere.center
      )
      const surface = Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        0.0
      )
      const offset = Cesium.Cartesian3.fromRadians(
        cartographic.longitude,
        cartographic.latitude,
        height
      )
      const tranlation = Cesium.Cartesian3.subtract(
        offset,
        surface,
        new Cesium.Cartesian3()
      )
      tileset.modelMatrix = Cesium.Matrix4.fromTranslation(tranlation)
    }
    this.rangeLister = height => {
      height = Number(height)
      if (isNaN(height)) {
        return
      }

      // 首次默认值
      if (tileset.ready) {
        translateionModel(tileset, height)
      } else {
        tileset.readyPromise.then(tileset => {
          translateionModel(tileset, height)
        })
      }
    }
  },
  methods: {
    changeRange(height) {
      this.rangeLister(height)
    }
  }
}
</script>
<style lang="scss" scoped>
$bg: #2d3a4b;
.slider-height {
  position: absolute;
  width: 50%;
  margin-left: 20px;
  z-index: 1;
}
.coord-bar {
  width: 600px;
  height: 30px;
  position: absolute;
  top: 70px;
  margin-left: 20px;
  z-index: 1;
}
font {
  size: 3;
  color: white;
}
</style>
