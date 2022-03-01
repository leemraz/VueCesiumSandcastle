<!--  -->
<template>
  <div>
    <div id="cesiumContainer" class="fullSize"></div>
  </div>
</template>

<script>
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
export default {
  name: 'CallbackProperty',
  data() {
    return {}
  },
  // 生命周期 - 创建完成（访问当前this实例）
  created() {},
  // 生命周期 - 挂载完成（访问DOM元素）
  mounted() {
    // This example illustrates a Callback Property, a property whose
    // value is lazily evaluated by a callback function.
    // Use a CallbackProperty when your data can't be pre-computed
    // or needs to be derived from other properties at runtime.
    // 翻译：这是一个回调属性的示例，该属性的值是通过callback函数来实现懒计算（延迟）的。
    // 当数据在不能预先计算或者需要从其他运行时的属性派生时，请使用此方法。
    const viewer = new Cesium.Viewer('cesiumContainer')
    viewer._cesiumWidget._creditContainer.style.display = 'none'
    viewer.clock.shouldAnimate = true
    const startLatitude = 35
    const startLongitude = -120
    let endLongitude
    const startTime = Cesium.JulianDate.now()
    // Add a polyline to the scene. Positions are dynamic.
    // 在场景中添加一条折线。位置是动态的。
    const isConstant = false
    const redLine = viewer.entities.add({
      polyline: {
        positions: new Cesium.CallbackProperty((time, result) => {
          endLongitude =
            startLongitude +
            0.001 * Cesium.JulianDate.secondsDifference(time, startTime)
          return Cesium.Cartesian3.fromDegreesArray(
            [startLongitude, startLatitude, endLongitude, startLatitude],
            Cesium.Ellipsoid.WGS84,
            result
          )
        }, isConstant),
        width: 5,
        material: Cesium.Color.RED
      }
    })
    const startCartographic = Cesium.Cartographic.fromDegrees(
      startLongitude,
      startLatitude
    )

    // use scratch object to avoid new allocations per frame.
    // 使用scratch对象来避免每帧的新分配。
    let endCartographic = new Cesium.Cartographic()
    const scratch = new Cesium.Cartographic()
    const geodesic = new Cesium.EllipsoidGeodesic()

    // Calculate the length of the line
    // 计算线的长度
    function getLength(time, result) {
      // Get the end position from the polyLine's callback.
      // 从折线的回调函数获取结束位置。
      const endPoint = redLine.polyline.positions.getValue(time, result)[1]
      endCartographic = Cesium.Cartographic.fromCartesian(endPoint)

      geodesic.setEndPoints(startCartographic, endCartographic)
      const lengthInMeters = Math.round(geodesic.surfaceDistance)
      return (lengthInMeters / 1000).toFixed(1) + ' km'
    }
    function getMidpoint(time, result) {
      // Get the end position from the polyLine's callback.
      // 从折线的回调函数获取结束位置。
      const endPoint = redLine.polyline.positions.getValue(time, result)[1]
      endCartographic = Cesium.Cartographic.fromCartesian(endPoint)

      geodesic.setEndPoints(startCartographic, endCartographic)
      // 提供沿测地线在指示部分上的点的位置。
      const midpointCartographic = geodesic.interpolateUsingFraction(
        0.5,
        scratch
      )
      return Cesium.Cartesian3.fromRadians(
        midpointCartographic.longitude,
        midpointCartographic.latitude
      )
    }

    // Label the polyline with calculated length.
    // 添加显示内容计算线长度的标签
    const label = viewer.entities.add({
      position: new Cesium.CallbackProperty(getMidpoint, isConstant),
      label: {
        // This callback updates the length to print each frame.
        // 这个回调会更新每一帧的线长度
        text: new Cesium.CallbackProperty(getLength, isConstant),
        font: '20px sans-serif',
        pixelOffset: new Cesium.Cartesian2(0.0, 20)
      }
    })

    // Keep the view centered.
    // 保持视角居中
    viewer.trackedEntity = label
  }
}
</script>
<style scoped>
/* @import url(); 引入css类 */
</style>
