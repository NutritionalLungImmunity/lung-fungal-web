<template>
  <div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import vtkFullScreenRenderWindow from 'vtk.js/Sources/Rendering/Misc/FullScreenRenderWindow';
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';

export default {
  name: 'Render3D',
  computed: {
    ...mapState([
      'polyData',
    ]),
  },
  watch: {
    polyData() {
      if (!this.polyData) {
        return;
      }

      const mapper = vtkMapper.newInstance();
      mapper.setInputData(this.polyData);

      const actor = vtkActor.newInstance();
      actor.setMapper(mapper);

      const renderWindowContainer = vtkFullScreenRenderWindow.newInstance();
      // TODO: This has no real mutator, so a warning is logged on '.set'
      renderWindowContainer.set({
        rootContainer: this.$el,
      });

      const renderer = renderWindowContainer.getRenderer();
      const renderWindow = renderWindowContainer.getRenderWindow();
      renderer.addActor(actor);

      renderer.resetCamera();
      renderWindow.render();
    },
  },
};
</script>
