<template>
  <div />
</template>

<script>
import { mapState } from 'vuex';

import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkColorTransferFunction from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction';
import vtkFullScreenRenderWindow from 'vtk.js/Sources/Rendering/Misc/FullScreenRenderWindow';
import vtkGlyph3DMapper from 'vtk.js/Sources/Rendering/Core/Glyph3DMapper';
import vtkLookupTable from 'vtk.js/Sources/Common/Core/LookupTable';
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
      // TODO: handler clearing of data
      this.vtk.geometryMapper.setInputData(this.geometryData);
      this.render();
    },
    sporeData() {
      if (!this.sporeData) {
        return;
      }
      this.vtk.sporeMapper.setInputData(this.sporeData, 0);
      this.render();
    },
    macrophageData() {
      if (!this.macrophageData) {
        return;
      }
      this.vtk.macrophageMapper.setInputData(this.macrophageData, 0);
      this.render();
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

    this.createGeometry();
    this.createSpore();
    this.createMacrophage();
  },
  methods: {
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
      ctfun.addRGBPoint(1, 1.0, 0.0, 0.0);
      ofun.addPoint(1, 0.4);
      // REGULAR_TISSUE = 2
      ctfun.addRGBPoint(2, 1.0, 0.8, 0.8);
      ofun.addPoint(2, 0.01);
      // EPITHELIUM = 3
      ctfun.addRGBPoint(3, 0.9, 0.9, 1.0);
      ofun.addPoint(3, 0.25);
      this.vtk.geometryActor.getProperty().setRGBTransferFunction(0, ctfun);
      this.vtk.geometryActor.getProperty().setScalarOpacity(0, ofun);
      // TODO: setInterpolationTypeToNearest should be more precise, since scalars are discrete
      this.vtk.geometryActor.getProperty().setInterpolationTypeToLinear();
      this.vtk.geometryActor.getProperty().setUseGradientOpacity(0, false);

      this.vtk.renderer.addVolume(this.vtk.geometryActor);
    },
    createSpore() {
      this.vtk.sporeGlyphSource = vtkSphereSource.newInstance();

      this.vtk.sporeMapper = vtkGlyph3DMapper.newInstance({
        scaleMode: vtkGlyph3DMapper.ScaleModes.SCALE_BY_CONSTANT,
        scaleFactor: 0.6,
      });
      this.vtk.sporeMapper.setInputConnection(this.vtk.sporeGlyphSource.getOutputPort(), 1);

      this.vtk.sporeLookupTable = vtkLookupTable.newInstance({
        numberOfColors: 1,
        hueRange: [0.3],
      });
      this.vtk.sporeMapper.setLookupTable(this.vtk.sporeLookupTable);

      this.vtk.sporeActor = vtkActor.newInstance();
      this.vtk.sporeActor.setMapper(this.vtk.sporeMapper);

      this.vtk.renderer.addActor(this.vtk.sporeActor);
    },
    createMacrophage() {
      this.vtk.macrophageGlyphSource = vtkSphereSource.newInstance();

      this.vtk.macrophageMapper = vtkGlyph3DMapper.newInstance({
        scaleMode: vtkGlyph3DMapper.ScaleModes.SCALE_BY_CONSTANT,
        scaleFactor: 0.4,
      });
      this.vtk.macrophageMapper
        .setInputConnection(this.vtk.macrophageGlyphSource.getOutputPort(), 1);

      this.vtk.macrophageLookupTable = vtkLookupTable.newInstance({
        numberOfColors: 1,
        hueRange: [0.6],
      });
      this.vtk.macrophageMapper.setLookupTable(this.vtk.macrophageLookupTable);

      this.vtk.macrophageActor = vtkActor.newInstance();
      this.vtk.macrophageActor.setMapper(this.vtk.macrophageMapper);

      // TODO: Rendering can be disabled here
      this.vtk.renderer.addActor(this.vtk.macrophageActor);
    },
    render() {
      if (this.geometryData && this.sporeData && this.macrophageData) {
        this.vtk.renderer.resetCamera();
        this.vtk.renderWindow.render();
      }
    },
  },
};
</script>