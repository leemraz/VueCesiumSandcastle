<template>
  <div>
    <div id="cesiumContainer" class="fullSize">
      <div class="btn-swap">
        <el-button type="primary" @click="onSwap">顺序切换</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
export default {
  name: 'OrderingDataSource',
  mounted() {
    const viewer = new Cesium.Viewer('cesiumContainer', {
      terrainProvider: Cesium.createWorldTerrain()
    })
    const czmlOne = [
      { id: 'document', name: 'CZML:Geomtries: Rectangle', version: '1.0' },
      {
        rectangle: {
          coordinates: {
            wsenDegrees: [-120, 40, -110, 50]
          },
          fill: true,
          material: {
            solidColor: {
              color: {
                rgba: [255, 0, 0, 255]
              }
            }
          }
        }
      },
      {
        rectangle: {
          coordinates: {
            wsenDegrees: [-110, 40, -100, 50]
          },
          fill: true,
          material: {
            solidColor: {
              color: {
                rgba: [0, 0, 255, 255]
              }
            }
          }
        }
      }
    ]

    const czmlTwo = [
      {
        id: 'document',
        name: 'CZML Geometries: Rectangle',
        version: '1.0'
      },
      {
        rectangle: {
          coordinates: {
            wsenDegrees: [-120, 45, -110, 55]
          },
          fill: true,
          material: {
            solidColor: {
              color: {
                rgba: [255, 255, 0, 255]
              }
            }
          }
        }
      },
      {
        rectangle: {
          coordinates: {
            wsenDegrees: [-110, 45, -100, 55]
          },
          fill: true,
          material: {
            solidColor: {
              color: {
                rgba: [0, 255, 255, 255]
              }
            }
          }
        }
      }
    ]

    const promisOne = Cesium.CzmlDataSource.load(czmlOne)
    const promisTwo = Cesium.CzmlDataSource.load(czmlTwo)
    viewer.dataSources.add(promisOne)
    viewer.dataSources.add(promisTwo)
    this.swapOrder = () => {
      Cesium.when.all([promisOne, promisTwo]).then(results => {
        const ds1 = results[0]
        const ds2 = results[1]
        if (viewer.dataSources.indexOf(ds1) === 0) {
          viewer.dataSources.raise(ds1)
        } else {
          viewer.dataSources.lower(ds1)
        }
      })
    }
  },
  methods: {
    onSwap() {
      this.swapOrder()
    }
  }
}
</script>
<style lang="scss" scoped>
.btn-swap {
  position: absolute;
  z-index: 1;
  top: 60px;
  left: 60px;
}
</style>
