<template>
  <div>
    <div id="cesiumContainer" class="fullSize">
      <el-select
        v-model="currentItem"
        value-key="name"
        clearable
        placeholder="请选择"
        @change="changeItem"
      >
        <el-option
          v-for="item in content"
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
  name: 'PolylinesOn3DTiles',
  data() {
    return {
      currentItem: '',
      content: [{ name: 'BIM' }, { name: 'Photogrammetry' }]
    }
  },
  created() {
    this.currentItem = this.content[0]
  },
  mounted() {
    const viewer = new Cesium.Viewer('cesiumContainer', {
      // eslint-disable-next-line new-cap
      terrainProvider: new Cesium.createWorldTerrain()
    })
    const scene = viewer.scene
    const powerplant = scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url: Cesium.IonResource.fromAssetId(8564),
        show: false
      })
    )
    const pipes = viewer.entities.add({
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArray([
          -76.36053390920833,
          34.949935893493596,
          -76.36055481641581,
          34.94993589886988,
          -76.36055477047704,
          34.94992280693651
        ]),
        width: 6,
        material: new Cesium.PolylineDashMaterialProperty({
          color: Cesium.Color.YELLOW,
          dashLength: 20.0
        }),
        show: false,
        clampToGround: true,
        classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
      }
    })

    const building = viewer.scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url: Cesium.IonResource.fromAssetId(40866)
      })
    )
    const route = viewer.entities.add({
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArray([
          -75.59604807301078,
          40.03948512841901,
          -75.59644577413066,
          40.039316280505446,
          -75.59584544997564,
          40.03846271524258,
          -75.59661425371488,
          40.03814087821916,
          -75.59664726332451,
          40.03818297772907
        ]),
        width: 6,
        material: new Cesium.PolylineDashMaterialProperty({
          color: Cesium.Color.YELLOW
        }),
        show: false,
        clampToGround: true,
        classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
      }
    })
    this.changBIM = () => {
      building.show = false
      route.polyline.show = false
      powerplant.show = true
      pipes.polyline.show = true
      scene.camera.setView({
        destination: new Cesium.Cartesian3(
          1234151.4883992162,
          -5086036.79436967,
          3633328.4278331124
        ),
        orientation: {
          heading: 5.593695742186853,
          pitch: -1.0786797635545216,
          roll: 6.27892466154778
        }
      })
    }
    this.changPhotogrammetry = () => {
      building.show = true
      route.polyline.show = true
      powerplant.show = false
      pipes.polyline.show = false
      scene.camera.setView({
        destination: new Cesium.Cartesian3(
          1216596.5376729995,
          -4736445.416889214,
          4081406.990364228
        ),
        orientation: {
          heading: 5.153176564030707,
          pitch: -0.9701972964526693,
          roll: 6.277883257569513
        }
      })
    }
    this.changBIM()
  },
  methods: {
    changeItem(item) {
      if (item.name === 'BIM') {
        this.changBIM()
      } else {
        this.changPhotogrammetry()
      }
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
