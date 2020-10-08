<template>
  <v-main>
    <v-container
      v-if="simulation"
      fluid
      class="pa-0"
    >
      <Render3D
        :simulation="simulation"
        :time-step="timeStep"
      />
      <v-container
        class="plot ma-4"
      >
        <Plot2D
          class="plot-container"
          :chart-data="chartData"
        />
      </v-container>
    </v-container>
  </v-main>
</template>

<script>
import Simulation from '@/data/simulation';
import Render3D from '@/components/Render3D.vue';
import Plot2D from '@/components/Plot2D.vue';

export default {
  name: 'ViewerPage',
  components: {
    Plot2D,
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
    times() {
      if (this.simulation) {
        // TODO: get time information from file
        const { length } = this.simulation.timeSteps;
        return Array.from({ length }, (v, k) => k + 1);
      }
      return [];
    },
    chartData() {
      if (this.simulation) {
        return {
          labels: this.times,
          datasets: [
            this.spores,
            this.macrophages,
          ],
        };
      }
      return {};
    },
    spores() {
      const color = 'rgb(54, 162, 235)';
      return {
        label: 'spores',
        data: this.simulation.timeSteps.map((t) => t.spore.getNumberOfPoints()),
        borderColor: color,
        backgroundColor: color,
        fill: false,
      };
    },
    macrophages() {
      const color = 'rgb(255, 99, 132)';
      return {
        label: 'macrophages',
        data: this.simulation.timeSteps.map((t) => t.macrophage.getNumberOfPoints()),
        borderColor: color,
        backgroundColor: color,
        fill: false,
      };
    },
  },
  asyncComputed: {
    simulation: {
      default: null,
      async get() {
        window.simulation = await Simulation.load(this.$route.params.id);
        return window.simulation; // Simulation.load(this.$route.params.id);
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
.plot {
  position: absolute;
  top: 0px;
  right: 0px;
  height: 400px;
  width: 600px;
  background: white;
}

.plot-container {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
