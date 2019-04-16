<template>
  <div />
</template>

<script>
import { mapState } from 'vuex';

import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkColorTransferFunction from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction';
import vtkFullScreenRenderWindow from 'vtk.js/Sources/Rendering/Misc/FullScreenRenderWindow';
import vtkGlyph3DMapper from 'vtk.js/Sources/Rendering/Core/Glyph3DMapper';
import vtkPiecewiseFunction from 'vtk.js/Sources/Common/DataModel/PiecewiseFunction';
import vtkSphereSource from 'vtk.js/Sources/Filters/Sources/SphereSource';
import vtkVolume from 'vtk.js/Sources/Rendering/Core/Volume';
import vtkVolumeMapper from 'vtk.js/Sources/Rendering/Core/VolumeMapper';

export default {
  name: 'Render3D',
  computed: {
    ...mapState({
      geometryData: state => state.geometry.imageData,
      sporeData: state => state.spore.polyData,
      macrophageData: state => state.macrophage.polyData,
    }),
  },
  static() {
    return {
      vtk: {},
    };
  },
  watch: {
    geometryData() {
      if (!this.geometryData) {
        return;
      }
      window.geometryData = this.geometryData;
      window.vtk = this.vtk;

      this.vtk.mapper = vtkVolumeMapper.newInstance();
      this.vtk.mapper.setInputData(this.geometryData);
      this.vtk.mapper.setSampleDistance(1.1);

      this.vtk.actor = vtkVolume.newInstance();
      this.vtk.actor.setMapper(this.vtk.mapper);

      // create color and opacity transfer functions
      const ctfun = vtkColorTransferFunction.newInstance();
      const ofun = vtkPiecewiseFunction.newInstance();
      // AIR = 0
      ctfun.addRGBPoint(0, 0.0, 0.0, 0.0);
      ofun.addPoint(0, 0.0);
      // BLOOD = 1
      ctfun.addRGBPoint(1, 1.0, 0.0, 0.0);
      ofun.addPoint(1, 0.4);
      // REGULAR_TISSUE = 2
      ctfun.addRGBPoint(2, 1.0, 0.8, 0.8);
      ofun.addPoint(2, 0.01);
      // EPITHELIUM = 3
      ctfun.addRGBPoint(3, 0.9, 0.9, 1.0);
      ofun.addPoint(3, 0.25);
      this.vtk.actor.getProperty().setRGBTransferFunction(0, ctfun);
      this.vtk.actor.getProperty().setScalarOpacity(0, ofun);
      // TODO: setInterpolationTypeToNearest should be more precise, since scalars are discrete
      this.vtk.actor.getProperty().setInterpolationTypeToLinear();
      this.vtk.actor.getProperty().setUseGradientOpacity(0, false);

      this.vtk.renderer.addVolume(this.vtk.actor);
      this.vtk.renderer.resetCamera();

      this.vtk.renderWindow.render();
    },
    sporeData() {
      if (!this.sporeData) {
        return;
      }
      window.sporeData = this.sporeData;
      this.vtk.sporeGlyphSource = vtkSphereSource.newInstance();

      this.vtk.sporeMapper = vtkGlyph3DMapper.newInstance({
        scaleMode: vtkGlyph3DMapper.ScaleModes.SCALE_BY_CONSTANT,
        scaleFactor: 0.6,
      });
      this.vtk.sporeMapper.setInputData(this.sporeData, 0);
      this.vtk.sporeMapper.setInputConnection(this.vtk.sporeGlyphSource.getOutputPort(), 1);

      this.vtk.sporeActor = vtkActor.newInstance();
      this.vtk.sporeActor.setMapper(this.vtk.sporeMapper);

      this.vtk.renderer.addActor(this.vtk.sporeActor);

      this.vtk.renderWindow.render();
    },
    macrophageData() {
      if (!this.macrophageData) {
        return;
      }
      window.macrophageData = this.macrophageData;
      this.vtk.macrophageGlyphSource = vtkSphereSource.newInstance();

      this.vtk.macrophageMapper = vtkGlyph3DMapper.newInstance({
        scaleMode: vtkGlyph3DMapper.ScaleModes.SCALE_BY_CONSTANT,
        scaleFactor: 0.4,
      });
      this.vtk.macrophageMapper.setInputData(this.macrophageData, 0);
      this.vtk.macrophageMapper
        .setInputConnection(this.vtk.macrophageGlyphSource.getOutputPort(), 1);
      // TODO: Change rendered color via this.vtk.macrophageMapper.getLookupTable()

      this.vtk.macrophageActor = vtkActor.newInstance();
      this.vtk.macrophageActor.setMapper(this.vtk.macrophageMapper);

      // TODO: Disable rendering this, since the data is at the same location as spores
      // this.vtk.renderer.addActor(this.vtk.macrophageActor);

      this.vtk.renderWindow.render();
    },
  },
  mounted() {
    this.vtk.renderWindowContainer = vtkFullScreenRenderWindow.newInstance();
    // TODO: This has no real mutator, so a warning is logged on '.set'
    this.vtk.renderWindowContainer.set({
      rootContainer: this.$el,
    });

    this.vtk.renderer = this.vtk.renderWindowContainer.getRenderer();
    this.vtk.renderWindow = this.vtk.renderWindowContainer.getRenderWindow();
  },
};
</script>
