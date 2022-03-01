<template>
  <div id="cesiumContainer" class="dashboard"></div>
</template>

<script>
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'

export default {
  name: 'Dashboard',
  mounted() {
    Cesium.Ion.defaultAccessToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3NDU1MTU4YS0zM2I4LTRjYmMtODdjYy01Y2MzOTllYWEzNGQiLCJpZCI6MTA4MzQsInNjb3BlcyI6WyJhc2wiLCJhc3IiLCJhc3ciLCJnYyIsInByIl0sImlhdCI6MTU5MzQ4NDEwMX0.EXWxXkTzmLHbV78ivjJsM6rOo8lxWkmLhiRMk9rAjfE'
    const viewer = new Cesium.Viewer('cesiumContainer')
  },
}
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 30px;
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
