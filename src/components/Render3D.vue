<template>
  <div>
  </div>
</template>

<script>
import vtkGenericRenderWindow from 'vtk.js/Sources/Rendering/Misc/GenericRenderWindow';
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';

export default {
  name: 'Render3D',
  props: {
    polyData: Object,
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

      const renderWindowContainer = vtkGenericRenderWindow.newInstance();
      renderWindowContainer.setContainer(this.$el);
      const renderer = renderWindowContainer.getRenderer();
      const renderWindow = renderWindowContainer.getRenderWindow();
      renderer.addActor(actor);

      renderer.resetCamera();
      renderWindow.render();
    },
  },
};
</script>
