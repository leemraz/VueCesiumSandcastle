<template>
  <div>
    <div id="cesiumContainer" class="fullSize">
      <el-select
        v-model="styleItem"
        value-key="name"
        clearable
        placeholder="请选择"
        @change="onChange"
      >
        <el-option
          v-for="item in styles"
          :key="item.name"
          :label="item.name"
          :value="item"
        />
      </el-select>
    </div>
  </div>
</template>
<script>
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
export default {
  name: 'BatchTableHierachy',
  data() {
    return {
      lngValue: null,
      latValue: null,
      altValue: null,
      entities: [],
      annotations: new Cesium.LabelCollection(),
      styles: [],
      styleItem: ''
    }
  },
  created() {
    this.addStyle = (name, style) => {
      this.styles.push({
        name: name,
        style: style
      })
    }

    this.addStyle('No style', {})

    this.addStyle('Color By Height', {
      color: {
        conditions: [
          ['${Height} >= 300', 'rgba(45, 0, 75, 0.5)'],
          ['${Height} >= 200', 'rgb(102, 71, 151)'],
          ['${Height} >= 100', 'rgb(170, 162, 204)'],
          ['${Height} >= 50', 'rgb(224, 226, 238)'],
          ['${Height} >= 25', 'rgb(252, 230, 200)'],
          ['${Height} >= 10', 'rgb(248, 176, 87)'],
          ['${Height} >= 5', 'rgb(198, 106, 11)'],
          ['true', 'rgb(127, 59, 8)']
        ]
      }
    })

    this.addStyle('Color By Latitude', {
      defines: {
        latitudeRadians: 'radians(${Latitude})'
      },
      color: {
        conditions: [
          ['${latitudeRadians} >= 0.7125', "color('purple')"],
          ['${latitudeRadians} >= 0.712', "color('red')"],
          ['${latitudeRadians} >= 0.7115', "color('orange')"],
          ['${latitudeRadians} >= 0.711', "color('yellow')"],
          ['${latitudeRadians} >= 0.7105', "color('lime')"],
          ['${latitudeRadians} >= 0.710', "color('cyan')"],
          ['true', "color('blue')"]
        ]
      }
    })

    this.addStyle('Color By Distance', {
      defines: {
        distance:
          'distance(vec2(radians(${Longitude}), radians(${Latitude})), vec2(-1.291777521, 0.7105706624))'
      },
      color: {
        conditions: [
          ['${distance} > 0.0012', "color('gray')"],
          [
            '${distance} > 0.0008',
            "mix(color('yellow'), color('red'), (${distance} - 0.008) / 0.0004)"
          ],
          [
            '${distance} > 0.0004',
            "mix(color('green'), color('yellow'), (${distance} - 0.0004) / 0.0004)"
          ],
          ['${distance} < 0.00001', "color('white')"],
          ['true', "mix(color('blue'), color('green'), ${distance} / 0.0004)"]
        ]
      }
    })

    this.addStyle('Color By Name Regex', {
      color:
        "(regExp('3').test(String(${BIN}))) ? color('cyan', 0.9) : color('purple', 0.1)"
    })

    this.addStyle('Hide By Height', {
      show: '${Height} > 200'
    })
    this.styleItem = this.styles[1]
  },
  mounted() {
    const viewer = new Cesium.Viewer('cesiumContainer', {
      terrainProvider: Cesium.createWorldTerrain()
    })
    viewer.scene.globe.depthTestAgainstTerrain = true

    // 去除版权信息
    viewer._cesiumWidget._creditContainer.style.display = 'none'
    // Set the initial camera view to look at Manhattan
    const initialPosition = Cesium.Cartesian3.fromDegrees(
      -74.01881302800248,
      40.69114333714821,
      753
    )
    const initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(
      21.27879878293835,
      -21.34390550872461,
      0.0716951918898415
    )
    viewer.scene.camera.setView({
      destination: initialPosition,
      orientation: initialOrientation,
      endTransform: Cesium.Matrix4.IDENTITY
    })

    // Load the NYC buildings tileset.
    const tileset = new Cesium.Cesium3DTileset({
      url: Cesium.IonResource.fromAssetId(75343)
    })

    viewer.scene.primitives.add(tileset)

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)
    // When a feature is left clicked, print its class name and properties
    // 当要素被左击时，打印出他的类名和属性信息
    handler.setInputAction(movement => {
      const feature = viewer.scene.pick(movement.position)
      if (!Cesium.defined(feature)) {
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
    this.setStyle = style => {
      tileset.style = new Cesium.Cesium3DTileStyle(style)
    }
  },
  methods: {
    onChange(item) {
      this.setStyle(item.style)
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
