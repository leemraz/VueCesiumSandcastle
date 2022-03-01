<template>
  <div>
    <div id="cesiumContainer" class="fullSize">
      <div class="select-type">
        <el-select
          v-model="value"
          value-key="name"
          clearable
          placeholder="请选择"
          @change="onChange"
        >
          <el-option
            v-for="item in clipObjects"
            :key="item.name"
            :label="item.name"
            :value="item"
          />
        </el-select>
        <el-checkbox
          v-model="showBV"
          @change="showBVChange"
        >Show bounding volume</el-checkbox>
        <el-checkbox
          v-model="showEES"
          @change="showEESChange"
        >Enable edge styling</el-checkbox>
      </div>
    </div>
  </div>
</template>
<script>
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import cesiumAir from '@/assets/SampleData/models/CesiumAir/Cesium_Air.glb'
import InstancedJson from '@/assets/SampleData/Cesium3DTiles/Instanced/InstancedOrientation/tileset.json'

// const cesiumAir = require('@/assets/SampleData/models/CesiumAir/Cesium_Air.glb')

export default {
  name: 'ClippingPlanes',
  data() {
    return {
      showBV: false,
      showEES: false,
      styles: [],
      value: '',
      targetY: 0.0,
      planeEntities: [],
      selectedPlane: null,
      clippingPlanes: null,
      tileset: null,
      clipObjects: [
        {
          name: 'BIM',
          resourceUrl: Cesium.IonResource.fromAssetId(8564)
        },
        {
          name: 'Point Cloud',
          resourceUrl: Cesium.IonResource.fromAssetId(16421)
        },
        {
          name: 'Instanced',
          // resourceUrl: '../../SampleData/Cesium3DTiles/Instanced/InstancedOrientation/tileset.json'
          resourceUrl: './static/SampleData/Cesium3DTiles/Instanced/InstancedOrientation/tileset.json'
        },
        {
          name: 'Model',
          // resourceUrl: '../../SampleData/models/CesiumAir/Cesium_Air.glb'
          resourceUrl: cesiumAir
        }
      ]
    }
  },
  computed: {
    viewModel: function() {
      return {
        debugBoundingVolumesEnabled: false,
        edgeStylingEnabled: true,
        exampleTypes: this.clipObjects,
        currentExampleType: this.clipObjects[0]
      }
    }
  },
  created() {
    this.value = this.clipObjects[0]
  },
  mounted() {
    const viewer = new Cesium.Viewer('cesiumContainer', {
      infoBox: false,
      selectionIndicator: false,
      //terrainProvider: Cesium.createWorldTerrain()
    })
    viewer.scene.globe.depthTestAgainstTerrain = true

    const scene = viewer.scene
    // 去除版权信息
    viewer._cesiumWidget._creditContainer.style.display = 'none'
    const that = this
    const createPlaneUpdateFunction = plane => {
      return function() {
        plane.distance = that.targetY
        return plane
      }
    }

    // Update plane on mouse move
    const moveHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    moveHandler.setInputAction(function(movement) {
      if (Cesium.defined(that.selectedPlane)) {
        const deltaY = movement.startPosition.y - movement.endPosition.y
        that.targetY += deltaY
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    const downHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    // 当鼠标向下的时候，选择平面
    downHandler.setInputAction(movement => {
      const pickedObject = scene.pick(movement.position)
      if (
        Cesium.defined(pickedObject) &&
        Cesium.defined(pickedObject.id) &&
        Cesium.defined(pickedObject.id.plane)
      ) {
        that.selectedPlane = pickedObject.id.plane
        that.selectedPlane.material = Cesium.Color.WHITE.withAlpha(0.05)
        that.selectedPlane.outlineColor = Cesium.Color.WHITE
        scene.screenSpaceCameraController.enableInputs = false
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN)
    const upHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    // 鼠标向上释放平面
    upHandler.setInputAction(function() {
      if (Cesium.defined(that.selectedPlane)) {
        that.selectedPlane.material = Cesium.Color.WHITE.withAlpha(0.1)
        that.selectedPlane.outlineColor = Cesium.Color.WHITE
        that.selectedPlane = undefined
      }

      scene.screenSpaceCameraController.enableInputs = true
    }, Cesium.ScreenSpaceEventType.LEFT_UP)
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)
    // When a feature is left clicked, print its class name and properties
    // 当要素被左击时，打印出他的类名和属性信息
    handler.setInputAction(movement => {
      const feature = viewer.scene.pick(movement.position)
      if (
        !Cesium.defined(feature) ||
        !(feature.getExactClassName instanceof Function)
      ) {
        return
      }
      console.log(`Class: ${feature.getExactClassName()}`)
      console.log(`Properties:`)
      const propertyNames = feature.getPropertyNames()
      const length = propertyNames.length
      for (let i = 0; i < length; i++) {
        const name = propertyNames[i]
        const value = feature.getProperty(name)
        console.log(`  ${name}: ${value}`)
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    // When a feature is middle clicked, hide it
    // 当鼠标中轴点击，隐藏对象
    handler.setInputAction(movement => {
      const feature = viewer.scene.pick(movement.position)
      if (!Cesium.defined(feature)) {
        return
      }
      feature.show = false
    }, Cesium.ScreenSpaceEventType.MIDDLE_CLICK)
    // that.setStyle = style => {
    //   that.tileset.style = new Cesium.Cesium3DTileStyle(style)
    // }

    this.loadTileset = url => {
      this.clippingPlanes = new Cesium.ClippingPlaneCollection({
        planes: [
          new Cesium.ClippingPlane(new Cesium.Cartesian3(0.0, 0.0, -1.0), 0.0)
        ],
        edgeWidth: this.viewModel.edgeStylingEnabled ? 1.0 : 0.0
      })

      this.tileset = viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url: url,
          clippingPlanes: that.clippingPlanes
        })
      )

      this.tileset.debugShowBoundingVolume =
        that.viewModel.debugBoundingVolumesEnabled
      return this.tileset.readyPromise
        .then(function() {
          const boundingSphere = that.tileset.boundingSphere
          const radius = boundingSphere.radius

          viewer.zoomTo(
            that.tileset,
            new Cesium.HeadingPitchRange(0.5, -0.2, radius * 4.0)
          )

          if (
            !Cesium.Matrix4.equals(
              that.tileset.root.transform,
              Cesium.Matrix4.IDENTITY
            )
          ) {
            // The clipping plane is initially positioned at the tileset's root transform.
            // Apply an additional matrix to center the clipping plane on the bounding sphere center.
            const transformCenter = Cesium.Matrix4.getTranslation(
              that.tileset.root.transform,
              new Cesium.Cartesian3()
            )
            const transformCartographic = Cesium.Cartographic.fromCartesian(
              transformCenter
            )
            const boundingSphereCartographic = Cesium.Cartographic.fromCartesian(
              that.tileset.boundingSphere.center
            )
            const height =
              boundingSphereCartographic.height - transformCartographic.height
            that.clippingPlanes.modelMatrix = Cesium.Matrix4.fromTranslation(
              new Cesium.Cartesian3(0.0, 0.0, height)
            )
          }

          for (let i = 0; i < that.clippingPlanes.length; ++i) {
            const plane = that.clippingPlanes.get(i)
            const planeEntity = viewer.entities.add({
              position: boundingSphere.center,
              plane: {
                dimensions: new Cesium.Cartesian2(radius * 2.5, radius * 2.5),
                material: Cesium.Color.WHITE.withAlpha(0.1),
                plane: new Cesium.CallbackProperty(
                  createPlaneUpdateFunction(plane),
                  false
                ),
                outline: true,
                outlineColor: Cesium.Color.WHITE
              }
            })

            that.planeEntities.push(planeEntity)
          }
          return that.tileset
        })
        .otherwise(function(error) {
          console.log(error)
        })
    }
    this.loadModel = url => {
      this.clippingPlanes = new Cesium.ClippingPlaneCollection({
        planes: [
          new Cesium.ClippingPlane(new Cesium.Cartesian3(0.0, 0.0, -1.0), 0.0)
        ],
        edgeWidth: this.viewModel.edgeStylingEnabled ? 1.0 : 0.0
      })
      const position = Cesium.Cartesian3.fromDegrees(
        -123.0744619,
        44.0503706,
        300.0
      )
      const heading = Cesium.Math.toRadians(135.0)
      const pitch = 0.0
      const roll = 0.0
      const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll)
      const orientation = Cesium.Transforms.headingPitchRollQuaternion(
        position,
        hpr
      )
      const entity = viewer.entities.add({
        name: url,
        position: position,
        orientation: orientation,
        model: {
          uri: url,
          scale: 8,
          minimumPixelSize: 100.0,
          clippingPlanes: this.clippingPlanes
        }
      })
      viewer.trackedEntity = entity
      for (let i = 0; i < this.clippingPlanes.length; ++i) {
        const plane = this.clippingPlanes.get(i)
        const planeEntity = viewer.entities.add({
          position: position,
          plane: {
            dimensions: new Cesium.Cartesian2(300.0, 300.0),
            material: Cesium.Color.WHITE.withAlpha(0.1),
            plane: new Cesium.CallbackProperty(
              createPlaneUpdateFunction(plane),
              false
            ),
            outline: true,
            outlineColor: Cesium.Color.RED
          }
        })
        this.planeEntities.push(planeEntity)
      }
    }

    this.reset = () => {
      viewer.entities.removeAll()
      viewer.scene.primitives.remove(this.tileset)
      this.planeEntities = []
      this.targetY = 0.0
      this.tileset = undefined
    }
    this.onChange(this.value)
  },
  methods: {
    onChange(item) {
      this.reset()
      if (item.name === 'Model') {
        this.loadModel(item.resourceUrl)
      } else {
        this.loadTileset(item.resourceUrl)
      }
    },
    showBVChange(checked) {
      if (Cesium.defined(this.tileset)) {
        this.tileset.debugShowBoundingVolume = checked
      }
    },
    showEESChange(checked) {
      var edgeWidth = checked ? 1.0 : 0.0
      this.clippingPlanes.edgeWidth = edgeWidth
    }
  }
}
</script>
<style lang="scss" scoped>
// .el-select {
//   position: absolute;
//   z-index: 1;
//   margin: 20px;
// }
.select-type {
  position: absolute;
  z-index: 1;
  margin: 20px;
}
.el-checkbox {
  color: #fcf2f2;
}
</style>
