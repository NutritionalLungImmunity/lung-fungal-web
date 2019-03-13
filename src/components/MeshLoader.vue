<template>
  <LocalFile
    accept="*.vtp"
    @load="fileLoaded"
  />
</template>

<script>
import vtkXMLPolyDataReader from 'vtk.js/Sources/IO/XML/XMLPolyDataReader';
import LocalFile from '@/components/LocalFile.vue';

export default {
  name: 'MeshLoader',
  components: {
    LocalFile,
  },
  methods: {
    /**
     * @param {ArrayBuffer} fileBuffer
     */
    fileLoaded(fileBuffer) {
      const polyDataReader = vtkXMLPolyDataReader.newInstance();

      const success = polyDataReader.parseAsArrayBuffer(fileBuffer);
      if (!success) {
        // TODO: can the error be gotten from the console?
        this.$emit('error', 'File cannot be read as VTK PolyData.');
        return;
      }

      const polyData = polyDataReader.getOutputData(0);
      this.$emit('load', polyData);
    },
  },
};
</script>
