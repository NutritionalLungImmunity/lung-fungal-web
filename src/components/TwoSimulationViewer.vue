<template>
  <v-container
    fluid
    class="pa-0 fill-height"
  >
    <v-row
      class="pa-0"
    >
      <v-col
        v-if="numberOfTimeSteps > 0"
        class="pa-0 col-6"
      >
        <Render3D
          :simulation="simulation1"
          :time-step="timeStep"
          molecule=""
        />
      </v-col>
      <v-col
        v-if="numberOfTimeSteps > 0"
        class="pa-0 col-6"
      >
        <Render3D
          :simulation="simulation2"
          :time-step="timeStep"
          molecule=""
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Simulation from '@/data/simulation';
import Render3D from '@/components/Render3D.vue';

export default {
  components: {
    Render3D,
  },
  props: {
    simulationFolderId1: {
      type: Number,
      required: true,
    },
    simulationFolderId2: {
      type: Number,
      required: true,
    },
  },
  data() {
    const simulation1 = new Simulation(this.simulationFolderId1);
    const simulation2 = new Simulation(this.simulationFolderId2);
    simulation1.update();
    simulation2.update();
    return {
      simulation1,
      simulation2,
      timeStep: 0,
    };
  },
  computed: {
    numberOfTimeSteps() {
      return Math.min(
        this.simulation1.timeSteps.length,
        this.simulation2.timeSteps.length,
      );
    },
  },
};
</script>

<style scoped>
.fill-height {
  height: calc(100vh - 64px);
}
</style>
