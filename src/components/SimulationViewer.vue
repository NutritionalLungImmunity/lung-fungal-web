<template>
  <div>
    <v-container
      v-if="simulation"
      fluid
      class="pa-0"
    >
      <Render3D
        :simulation="simulation"
        :time-step="timeStep"
        @point="selectedPointInfo = $event"
      />
      <v-container
        class="time-control pa-0"
      >
        <v-row class="ma-4">
          <v-btn
            tile
            :disabled="playing"
            @click="previousTimeStep"
          >
            <v-icon>mdi-skip-previous</v-icon>
          </v-btn>
          <v-btn
            :depressed="playing"
            tile
            @click="playOrStop"
          >
            <v-icon>{{ playing ? "mdi-stop" : "mdi-play" }}</v-icon>
          </v-btn>
          <v-btn
            tile
            :disabled="playing"
            @click="nextTimeStep"
          >
            <v-icon>mdi-skip-next</v-icon>
          </v-btn>
        </v-row>
        <v-row
          v-if="selectedPointInfo.id !== undefined"
          class="ma-4"
        >
          <v-simple-table
            :dense="true"
          >
            <template v-slot:default>
              <tbody>
                <tr
                  v-for="(value, name) in selectedPointInfo"
                  :key="name"
                >
                  <td>{{ name }}</td>
                  <td>{{ value }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-row>
      </v-container>
      <v-container
        class="plot ma-4"
      >
        <Plot2D
          class="plot-container"
          :time="times[timeStep]"
          :chart-data="chartData"
        />
      </v-container>
    </v-container>
    <v-container
      v-else
      fluid
    >
      Loading...
    </v-container>
  </div>
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
  props: {
    simulationId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      playing: false,
      timeStep: 0,
      timeStepShowDuration: 1000,
      selectedPointInfo: {},
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
  watch: {
    timeStep() {
      // TODO: Update point info rather than clear it.
      this.selectedPointInfo = {};
    },
  },
  asyncComputed: {
    simulation: {
      default: null,
      async get() {
        return Simulation.load(this.simulationId);
      },
    },
  },
  methods: {
    nextTimeStep() {
      this.timeStep = (this.timeStep + 1) % this.simulation.timeSteps.length;
    },
    previousTimeStep() {
      this.timeStep = (this.timeStep - 1 + this.simulation.timeSteps.length)
        % this.simulation.timeSteps.length;
    },
    playOrStop() {
      this.playing = !this.playing;
      if (this.playing) {
        this.playNextFrame();
      }
    },
    playNextFrame() {
      if (!this.playing) {
        return;
      }
      this.nextTimeStep();
      window.setTimeout(this.playNextFrame.bind(this), this.timeStepShowDuration);
    },
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

.time-control {
  position: absolute;
  top: 0px;
  left: 0px;
  max-width: 300px;
}
</style>
