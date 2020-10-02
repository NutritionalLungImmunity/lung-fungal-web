<template>
  <v-content>
    <v-container fluid>
      <Render3D
        v-if="simulation"
        :simulation="simulation"
        :time-step="timeStep"
      />
    </v-container>
  </v-content>
</template>

<script>
import Simulation from '@/data/simulation';
import Render3D from '@/components/Render3D.vue';

export default {
  name: 'ViewerPage',
  components: {
    Render3D,
  },
  data() {
    return {
      timeStep: 0,
    };
  },
  computed: {
    numberOfTimeSteps() {
      if (this.simulation) {
        return this.simulation.timeSteps.length;
      }
      return 0;
    },
  },
  asyncComputed: {
    simulation: {
      default: null,
      async get() {
        return Simulation.load(this.$route.params.id);
      },
    },
  },
  methods: {
  },
};
</script>

<style scoped>
.toolbar-items{
  width: 90%;
}
.drawer-wrapper {
  height: 100%;
}
</style>
