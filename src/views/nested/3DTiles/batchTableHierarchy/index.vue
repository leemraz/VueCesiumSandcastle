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

    this.addStyle('Color by building', {
      color: {
        conditions: [
          ["${building_name} === 'building0'", "color('purple')"],
          ["${building_name} === 'building1'", "color('red')"],
          ["${building_name} === 'building2'", "color('orange')"],
          ['true', "color('blue')"]
        ]
      }
    })

    this.addStyle('Color all doors', {
      color: {
        conditions: [
          ["isExactClass('door')", "color('orange')"],
          ['true', "color('white')"]
        ]
      }
    })

    this.addStyle('Color all features derived from door', {
      color: {
        conditions: [
          ["isClass('door')", "color('orange')"],
          ['true', "color('white')"]
        ]
      }
    })

    this.addStyle('Color features by class name', {
      defines: {
        suffix: "regExp('door(.*)').exec(getExactClassName())"
      },
      color: {
        conditions: [
          ["${suffix} === 'knob'", "color('yellow')"],
          ["${suffix} === ''", "color('lime')"],
          ['${suffix} === null', "color('gray')"],
          ['true', "color('blue')"]
        ]
      }
    })

    this.addStyle('Style by height', {
      color: {
        conditions: [
          ['${height} >= 10', "color('purple')"],
          ['${height} >= 6', "color('red')"],
          ['${height} >= 5', "color('orange')"],
          ['true', "color('blue')"]
        ]
      }
    })
    this.styleItem = this.styles[0]
  },
  mounted() {
    // #region
    // 门把手、门、屋顶和墙壁都采用了批处理表层次结构。
    // 由于建筑和区域没有几何形状的支持，它们没有直接的风格。然而
    // 可以编写将建筑和区域属性考虑在内的样式。
    // Doorknobs, doors, roofs, and walls are styled with the batch table hierarchy.
    // Since buildings and zones are not backed by geometry they are not styled directly. However
    // styles may be written that take building and zone properties into account.
    //
    // Hierarchy layout (doorknobs are children of doors):
    //
    //   zone0
    //     building0
    //       roof0
    //       wall0
    //       door0 - doorknob0
    //       door1 - doorknob1
    //       door2 - doorknob2
    //       door3 - doorknob3
    //     building1
    //       roof1
    //       wall1
    //       door4 - doorknob4
    //       door5 - doorknob5
    //       door6 - doorknob6
    //       door7 - doorknob7
    //     building2
    //       roof2
    //       wall2
    //       door8 - doorknob8
    //       door9 - doorknob9
    //       door10 - doorknob10
    //       door11 - doorknob11
    //
    // Class properties:
    //
    //   zone:
    //     * zone_building
    //     * zone_name
    //   building:
    //     * building_area
    //     * building_name
    //   wall:
    //     * wall_paint
    //     * wall_windows
    //     * wall_name
    //   roof:
    //     * roof_paint
    //     * roof_name
    //   door:
    //     * door_mass
    //     * door_width
    //     * door_name
    //   doorknob:
    //     * doorknob_size
    //     * doorknob_name
    // #endregion
    const viewer = new Cesium.Viewer('cesiumContainer')
    viewer.clock.currentTime = new Cesium.JulianDate(2457522.154792)
    // 去除版权信息
    viewer._cesiumWidget._creditContainer.style.display = 'none'
    const tileset = new Cesium.Cesium3DTileset({
      url:
        '../../SampleData/Cesium3DTiles/Hierarchy/BatchTableHierarchy/tileset.json'
    })

    viewer.scene.primitives.add(tileset)
    viewer.zoomTo(tileset, new Cesium.HeadingPitchRange(0.0, -0.3, 0.0))
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
