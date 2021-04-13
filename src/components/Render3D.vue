<template>
  <div
    class="render3d"
  >
    <div
      v-if="hasWebGL"
      ref="vtkContainer"
      v-resize="resize"
      class="render3d"
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
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkCalculator from 'vtk.js/Sources/Filters/General/Calculator';
import vtkColorTransferFunction from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction';
import vtkGlyph3DMapper from 'vtk.js/Sources/Rendering/Core/Glyph3DMapper';
import vtkInteractorStyleTrackballCamera from 'vtk.js/Sources/Interaction/Style/InteractorStyleTrackballCamera';
import vtkLookupTable from 'vtk.js/Sources/Common/Core/LookupTable';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';
import vtkImageMarchingCubes from 'vtk.js/Sources/Filters/General/ImageMarchingCubes';
import vtkOpenGLHardwareSelector from 'vtk.js/Sources/Rendering/OpenGL/HardwareSelector';
import vtkOpenGLRenderWindow from 'vtk.js/Sources/Rendering/OpenGL/RenderWindow';
import vtkPiecewiseFunction from 'vtk.js/Sources/Common/DataModel/PiecewiseFunction';
import vtkRenderWindow from 'vtk.js/Sources/Rendering/Core/RenderWindow';
import vtkRenderWindowInteractor from 'vtk.js/Sources/Rendering/Core/RenderWindowInteractor';
import vtkRenderer from 'vtk.js/Sources/Rendering/Core/Renderer';
import vtkSphereSource from 'vtk.js/Sources/Filters/Sources/SphereSource';
import vtkVolume from 'vtk.js/Sources/Rendering/Core/Volume';
import vtkVolumeMapper from 'vtk.js/Sources/Rendering/Core/VolumeMapper';
import {
  ColorMode,
  ScalarMode,
} from 'vtk.js/Sources/Rendering/Core/Mapper/Constants';
import { AttributeTypes } from 'vtk.js/Sources/Common/DataModel/DataSetAttributes/Constants';
import { FieldAssociations, FieldDataTypes } from 'vtk.js/Sources/Common/DataModel/DataSet/Constants';

import Simulation from '@/data/simulation';
import hasWebGL from '@/webgl';

const SPHERE_RESOLUTION = 32;

export default {
  name: 'Render3D',
  props: {
    simulation: {
      type: Simulation,
      required: true,
    },
    timeStep: {
      type: Number,
      required: true,
    },
    molecule: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      activeDataSet: null,
    };
  },
  computed: {
    state() {
      return this.simulation.timeSteps[this.timeStep];
    },
    geometry() {
      return this.state.geometry;
    },
    spore() {
      return this.state.spore;
    },
    macrophage() {
      return this.state.macrophage;
    },
    neutrophil() {
      return this.state.neutrophil;
    },
    molecules() {
      return this.state.molecules;
    },
    hasWebGL() {
      return hasWebGL;
    },
    activeType() {
      if (this.activeDataSet === this.vtk.sporeColorFilter.getOutputData()) {
        return 'A. fumigatus';
      }
      if (this.activeDataSet === this.macrophage) {
        return 'macrophage';
      }
      if (this.activeDataSet === this.neutrophil) {
        return 'neutrophil';
      }
      return '';
    },
  },
  watch: {
    state() {
      this.setStateData();
    },
    molecule() {
      this.setStateData();
    },
  },
  beforeDestroy() {
    this.removeSelected();
    this.vtk.interactor.unbindEvents();
    this.vtk.openglRenderWindow.delete();
    delete window.vtk;
  },
  created() {
    const renderWindow = vtkRenderWindow.newInstance();
    const renderer = vtkRenderer.newInstance({ background: [0.2, 0.3, 0.4] });
    renderWindow.addRenderer(renderer);
    const interactor = vtkRenderWindowInteractor.newInstance();

    const openglRenderWindow = vtkOpenGLRenderWindow.newInstance();
    renderWindow.addView(openglRenderWindow);

    interactor.setView(openglRenderWindow);
    interactor.initialize();
    interactor.setInteractorStyle(vtkInteractorStyleTrackballCamera.newInstance());

    const selector = vtkOpenGLHardwareSelector.newInstance();
    selector.setFieldAssociation(FieldAssociations.FIELD_ASSOCIATION_POINTS);
    selector.attach(openglRenderWindow, renderer);

    const marchingCubes = vtkImageMarchingCubes.newInstance({
      contourValue: 1,
      computeNormals: true,
      mergePoints: true,
    });

    this.vtk = {
      renderWindow,
      renderer,
      interactor,
      openglRenderWindow,
      selector,
      molecule: {
        marchingCubes,
        mapper: vtkMapper.newInstance({ colorMode: ColorMode.MAP_SCALARS }),
        actor: vtkActor.newInstance(),
      },
      selected: {},
    };

    // Expose to windows
    window.vtk = this.vtk;

    // map methods to vue component
    this.render = this.vtk.renderWindow.render;
    this.resetCamera = renderer.resetCamera;
    this.updateSize = () => {
      const container = this.$refs.vtkContainer;
      if (container) {
        const { width, height } = container.getBoundingClientRect();
        openglRenderWindow.setSize(width, height);
      }
    };
  },
  mounted() {
    const container = this.$refs.vtkContainer;
    this.vtk.openglRenderWindow.setContainer(container);
    this.vtk.interactor.bindEvents(container);

    this.createGeometry();
    this.createMolecules();
    this.createSpore();
    this.createMacrophage();
    this.createNeutrophil();
    this.setStateData();

    this.vtk.renderWindow
      .getInteractor()
      .onLeftButtonPress((evt) => this.onLeftClick(evt));
    this.updateSize();
    this.resetCamera();
    this.render();
  },
  methods: {
    selectedPoint(center) {
      const source = vtkSphereSource.newInstance({
        thetaResolution: SPHERE_RESOLUTION,
        phiResolution: SPHERE_RESOLUTION,
      });
      source.setCenter(center);
      source.setRadius(6);
      const actor = vtkActor.newInstance();
      const mapper = vtkMapper.newInstance();

      mapper.setInputData(source.getOutputData());
      actor.setMapper(mapper);
      actor.getProperty().setColor(0, 0, 0);

      return {
        source,
        actor,
        mapper,
      };
    },
    removeSelected() {
      if (!this.vtk.selected.actor) {
        return;
      }
      this.vtk.renderer.removeActor(this.vtk.selected.actor);
      this.vtk.selected = {};
    },
    pick(x, y) {
      // Reset previous activeDataSet
      if (this.activeDataSet) {
        const scaleArray = this.activeDataSet.getPointData().getArray('scale');
        scaleArray.getData().fill(1);
        scaleArray.modified();
        this.activeDataSet.modified();
        this.activeDataSet = null;
      }

      // Prevent volume rendering picking
      this.vtk.geometryActor.setVisibility(false);
      this.vtk.molecule.actor.setVisibility(false);

      // Hardware selection picking
      this.vtk.selector.setArea(x, y, x, y);
      this.vtk.selector.releasePixBuffers();
      const ok = this.vtk.selector.captureBuffers();
      if (ok) {
        const selection = this.vtk.selector.generateSelection(x, y, x, y);
        if (selection && selection.length) {
          const { compositeID, prop } = selection[0].getProperties();
          const ds = prop.getMapper().getInputData();
          const scaleArray = ds.getPointData().getArray('scale');

          scaleArray.getData()[compositeID] = 2;
          scaleArray.modified();
          ds.modified();

          this.activeDataSet = ds;
          const info = ds.getPointData().getArrays().map((a) => {
            const name = a.getName();
            const numComponents = a.getNumberOfComponents();
            const start = compositeID * numComponents;
            const value = a.getData().slice(start, start + numComponents);
            return [
              name,
              value,
            ];
          });

          this.$emit('point', Object.fromEntries([['id', compositeID], ['type', this.activeType], ...info]));
        }
      }

      // Make sure the volume is still visible for std rendering
      this.vtk.geometryActor.setVisibility(true);
      this.vtk.molecule.actor.setVisibility(true);
    },
    onLeftClick(evt) {
      if (evt.pokedRenderer !== this.vtk.renderer) {
        return;
      }

      const { position: { x, y } } = evt;
      this.pick(x, y);
    },
    setStateData() {
      this.vtk.geometryMapper.setInputData(this.geometry);
      this.vtk.sporeColorFilter.setInputData(this.spore, 0);
      this.macrophage.getPointData().setActiveScalars('dead');
      this.vtk.macrophageMapper.setInputData(this.macrophage, 0);
      this.neutrophil.getPointData().setActiveScalars('dead');
      this.vtk.neutrophilMapper.setInputData(this.neutrophil, 0);
      this.updateMolecules();
      this.render();
    },
    updateMolecules() {
      this.vtk.renderer.removeActor(this.vtk.molecule.actor);
      if (this.molecule === '') {
        return;
      }
      this.vtk.renderer.addActor(this.vtk.molecule.actor);
      const pd = this.molecules.getPointData();
      pd.setActiveScalars(this.molecule);
      this.vtk.molecule.marchingCubes.setInputData(this.molecules);
      const dataRange = pd.getScalars().getRange();
      const isoValue = (dataRange[0] + dataRange[1]) / 3;
      this.vtk.molecule.marchingCubes.setContourValue(isoValue);
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
    createSpore() {
      // TODO: I have no idea why the calculator filter inverts the color values...
      const colors = [
        Uint8Array.from([256 - 92, 256 - 235, 256 - 53]),
        Uint8Array.from([256 - 33, 256 - 84, 256 - 19]),
      ];

      this.vtk.sporeColorFilter = vtkCalculator.newInstance();
      this.vtk.sporeColorFilter.setFormulaSimple(
        FieldDataTypes.POINT,
        ['internalized'],
        'color',
        (internalized) => colors[internalized],
        {
          numberOfOutputComponents: 3,
          outputAttribute: AttributeTypes.SCALARS,
        },
      );

      this.vtk.sporeGlyphSource = vtkSphereSource.newInstance({
        thetaResolution: SPHERE_RESOLUTION,
        phiResolution: SPHERE_RESOLUTION,
      });

      this.vtk.sporeMapper = vtkGlyph3DMapper.newInstance({
        scaleMode: vtkGlyph3DMapper.ScaleModes.SCALE_BY_MAGNITUDE,
        scaleArray: 'scale',
        scaleFactor: 5,
        colorMode: ColorMode.DIRECT_SCALARS,
      });
      this.vtk.sporeMapper.setInputConnection(this.vtk.sporeColorFilter.getOutputPort(), 0);
      this.vtk.sporeMapper.setInputConnection(this.vtk.sporeGlyphSource.getOutputPort(), 1);

      this.vtk.sporeActor = vtkActor.newInstance();
      this.vtk.sporeActor.setMapper(this.vtk.sporeMapper);

      this.vtk.renderer.addActor(this.vtk.sporeActor);
    },
    createMolecules() {
      this.vtk.molecule.actor.setMapper(this.vtk.molecule.mapper);
      this.vtk.molecule.actor.getProperty().setColor(0, 1, 1);
      this.vtk.molecule.actor.getProperty().setOpacity(0.8);
      this.vtk.molecule.mapper.setInputConnection(this.vtk.molecule.marchingCubes.getOutputPort());
    },
    createMacrophage() {
      this.vtk.macrophageGlyphSource = vtkSphereSource.newInstance({
        thetaResolution: SPHERE_RESOLUTION,
        phiResolution: SPHERE_RESOLUTION,
      });

      this.vtk.macrophageMapper = vtkGlyph3DMapper.newInstance({
        scaleMode: vtkGlyph3DMapper.ScaleModes.SCALE_BY_MAGNITUDE,
        scaleArray: 'scale',
        scaleFactor: 8,
        colorMode: ColorMode.MAP_SCALARS,
        scalarMode: ScalarMode.USE_POINT_FIELD_DATA,
        scalarRange: [0, 1],
      });
      this.vtk.macrophageMapper
        .setInputConnection(this.vtk.macrophageGlyphSource.getOutputPort(), 1);

      this.vtk.macrophageLookupTable = vtkLookupTable.newInstance({
        numberOfColors: 1,
        hueRange: [0.6],
      });
      this.vtk.macrophageMapper.setLookupTable(this.vtk.macrophageLookupTable);

      this.vtk.macrophageActor = vtkActor.newInstance();
      this.vtk.macrophageActor.getProperty().setColor(253 / 255, 98 / 255, 132 / 255);
      this.vtk.macrophageActor.setMapper(this.vtk.macrophageMapper);

      // TODO: Rendering can be disabled here
      this.vtk.renderer.addActor(this.vtk.macrophageActor);
    },
    createNeutrophil() {
      this.vtk.neutrophilGlyphSource = vtkSphereSource.newInstance({
        thetaResolution: SPHERE_RESOLUTION,
        phiResolution: SPHERE_RESOLUTION,
      });

      this.vtk.neutrophilMapper = vtkGlyph3DMapper.newInstance({
        scaleMode: vtkGlyph3DMapper.ScaleModes.SCALE_BY_MAGNITUDE,
        scaleArray: 'scale',
        scaleFactor: 5,
        colorMode: ColorMode.MAP_SCALARS,
        scalarMode: ScalarMode.USE_POINT_FIELD_DATA,
      });
      this.vtk.neutrophilMapper.setColorByArrayName('granule_count');
      this.vtk.neutrophilMapper
        .setInputConnection(this.vtk.neutrophilGlyphSource.getOutputPort(), 1);

      this.vtk.neutrophilLookupTable = vtkLookupTable.newInstance({
        numberOfColors: 1,
        hueRange: [0.7], // TODO: (ACK) what color is this anyway?
      });
      this.vtk.neutrophilMapper.setLookupTable(this.vtk.neutrophilLookupTable);

      this.vtk.neutrophilActor = vtkActor.newInstance();
      this.vtk.neutrophilActor.setMapper(this.vtk.neutrophilMapper);

      // TODO: Rendering can be disabled here
      this.vtk.renderer.addActor(this.vtk.neutrophilActor);
    },
    render() {
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
.render3d {
  height: calc(100vh - 112px);
}
</style>
