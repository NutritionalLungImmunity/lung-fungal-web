<template>
  <v-main
    class="px-0"
  >
    <two-simulation-viewer
      simulation-folder-id1="60d0d902af83f3c403fe1895"
      simulation-folder-id2="60d0d902af83f3c403fe1895"
    />
  </v-main>
</template>

<script>
import TwoSimulationViewer from '@/components/TwoSimulationViewer.vue';

export default {
  name: 'ComparePage',
  components: {
    TwoSimulationViewer,
  },
  data() {

  },
};
</script>
