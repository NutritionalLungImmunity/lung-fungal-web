<template>
  <div
    class="geometry"
  >
    <div
      v-if="hasWebGL"
      ref="vtkContainer"
      v-resize="resize"
      class="geometry"
    />
    <v-container
      class="fill-height"
      fluid
    >
      <v-row
        justify="center"
      >
        No WebGL support detected.
      </v-row>
    </v-container>
  </div>
</template>

<script>
// TODO: deduplicate some of this code with render3d
import vtkColorTransferFunction from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction';
import vtkFullScreenRenderWindow from 'vtk.js/Sources/Rendering/Misc/FullScreenRenderWindow';
import vtkPiecewiseFunction from 'vtk.js/Sources/Common/DataModel/PiecewiseFunction';
import vtkVolume from 'vtk.js/Sources/Rendering/Core/Volume';
import vtkVolumeMapper from 'vtk.js/Sources/Rendering/Core/VolumeMapper';

import hasWebGL from '@/webgl';

export default {
  name: 'Geometry',
  props: {
    geometry: {
      type: Object,
      required: true,
    },
  },
  computed: {
    hasWebGL() {
      return hasWebGL;
    },
  },
  static() {
    return {
      vtk: {},
    };
  },
  watch: {
    state() {
      this.setStateData();
    },
  },
  beforeDestroy() {
    // force delete the webgl context when destroying the component
    const rw = this.vtk.renderWindow;
    if (rw) {
      rw.getInteractor().unbindEvents();
      const gl = this.$el.querySelector('canvas').getContext('webgl2');
      gl.getExtension('WEBGL_lose_context').loseContext();
    }
  },
  mounted() {
    this.vtk.renderWindowContainer = vtkFullScreenRenderWindow.newInstance({
      rootContainer: this.$refs.vtkContainer,
      containerStyle: {
        width: '100%',
        height: '100%',
      },
    });

    this.vtk.renderer = this.vtk.renderWindowContainer.getRenderer();
    this.vtk.renderWindow = this.vtk.renderWindowContainer.getRenderWindow();

    this.createGeometry();
    this.setStateData();
  },
  methods: {
    setStateData() {
      this.vtk.geometryMapper.setInputData(this.geometry);
      this.render();
    },
    createGeometry() {
      this.vtk.geometryMapper = vtkVolumeMapper.newInstance();
      this.vtk.geometryMapper.setSampleDistance(1.1);

      this.vtk.geometryActor = vtkVolume.newInstance();
      this.vtk.geometryActor.setMapper(this.vtk.geometryMapper);

      // create color and opacity transfer functions
      const ctfun = vtkColorTransferFunction.newInstance();
      const ofun = vtkPiecewiseFunction.newInstance();
      // AIR = 0
      ctfun.addRGBPoint(0, 0.0, 0.0, 0.0);
      ofun.addPoint(0, 0.0);
      // BLOOD = 1
      ctfun.addRGBPoint(0.9, 1.0, 0.0, 0.0);
      ofun.addPoint(0.5, 0.0);
      ctfun.addRGBPoint(1, 1.0, 0.0, 0.0);
      ofun.addPoint(1, 0.05);
      ctfun.addRGBPoint(1.1, 1.0, 0.0, 0.0);
      ofun.addPoint(1.5, 0.0);
      // REGULAR_TISSUE = 2
      ctfun.addRGBPoint(2, 1.0, 0.8, 0.8);
      ofun.addPoint(2, 0.00);
      // EPITHELIUM = 3
      ctfun.addRGBPoint(2.5, 1.0, 0.8, 0.8);
      ofun.addPoint(2.5, 0.00);
      ctfun.addRGBPoint(3, 0.9, 0.9, 1.0);
      ofun.addPoint(3, 0.05);
      ctfun.addRGBPoint(3.5, 1.0, 0.8, 0.8);
      ofun.addPoint(3.5, 0.00);

      this.vtk.geometryActor.getProperty().setRGBTransferFunction(0, ctfun);
      this.vtk.geometryActor.getProperty().setScalarOpacity(0, ofun);
      // TODO: setInterpolationTypeToNearest should be more precise, since scalars are discrete
      this.vtk.geometryActor.getProperty().setInterpolationTypeToLinear();
      this.vtk.geometryActor.getProperty().setUseGradientOpacity(0, false);

      this.vtk.renderer.addVolume(this.vtk.geometryActor);
    },
    render() {
      this.vtk.renderer.resetCamera();
      this.vtk.renderWindow.render();
    },
    resize() {
      this.$nextTick().then(() => {
        if (this.vtk && this.vtk.renderWindowContainer) {
          this.vtk.renderWindowContainer.resize();
        }
      });
    },
  },
};
</script>

<style scoped>
.geometry {
  height: calc(100vh - 132px);
}
</style>
