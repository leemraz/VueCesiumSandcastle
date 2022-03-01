<template>
  <div>
    <div id="cesiumContainer"></div>
  </div>
</template>
<script>
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
//import CeisumGLB from '@/assets/SampleData/models/CesiumMan/Cesium_Man.glb'
export default {
  name: 'box',
  mounted() {
    var viewer = new Cesium.Viewer('cesiumContainer', {
      shouldAnimate: true
    })
    var scene = viewer.scene
    viewer.scene.logarithmicDepthBuffer = false
    var position = Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706)
    var url = 'SampleData/models/CesiumMan/Cesium_Man.glb'
    // var url = CeisumGLB
    var entity = (viewer.trackedEntity = viewer.entities.add({
      name: url,
      position: position,
      model: {
        uri: url
      }
    }))

    // Shade selected model with highlight.
    var fragmentShaderSource =
      'uniform sampler2D colorTexture;\n' +
      'varying vec2 v_textureCoordinates;\n' +
      'uniform vec4 highlight;\n' +
      'void main() {\n' +
      '    vec4 color = texture2D(colorTexture, v_textureCoordinates);\n' +
      '    if (czm_selected()) {\n' +
      '        vec3 highlighted = highlight.a * highlight.rgb + (1.0 - highlight.a) * color.rgb;\n' +
      '        gl_FragColor = vec4(highlighted, 1.0);\n' +
      '    } else { \n' +
      '        gl_FragColor = color;\n' +
      '    }\n' +
      '}\n'
    var stage = scene.postProcessStages.add(
      new Cesium.PostProcessStage({
        fragmentShader: fragmentShaderSource,
        uniforms: {
          highlight: function() {
            return new Cesium.Color(1.0, 0.0, 0.0, 0.5)
          }
        }
      })
    )
    stage.selected = []

    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    handler.setInputAction(function(movement) {
      var pickedObject = viewer.scene.pick(movement.endPosition)
      if (Cesium.defined(pickedObject)) {
        stage.selected = [pickedObject.primitive]
      } else {
        stage.selected = []
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  }
}
</script>
<style scoped>
/* @import '~@/assets/bucket.css'; */
</style>
