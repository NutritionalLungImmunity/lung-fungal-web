<template>
  <input
    :accept="accept"
    type="file"
    @change.stop="filesSelected($event.currentTarget.files)"
  >
</template>

<script>
import PromiseFileReader from 'promise-file-reader';

export default {
  name: 'LocalFile',
  props: {
    accept: {
      type: String,
      default: '',
    },
  },
  methods: {
    /**
     * @param {FileList} files
     */
    async filesSelected(files) {
      if (files.length !== 1) {
        // TODO: Better error handling
        // eslint-disable-next-line no-alert
        alert(`Wrong number of files selected: ${files.length}`);
        return;
      }
      const file = files[0];

      // TODO: add JSDoc types to PromiseFileReader
      const arrayBuffer = await PromiseFileReader.readAsArrayBuffer(file);

      this.$emit('load', arrayBuffer);
    },
  },
};
</script>
