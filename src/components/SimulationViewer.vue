<template>
  <div>
    <v-container
      v-if="numberOfTimeSteps > 0"
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
          <selected-point-panel
            :info="selectedPointInfo"
          />
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
      class="full-screen-progress fill-height pa-0"
      fluid
    >
      <v-row
        justify="center"
      >
        <v-progress-circular
          :size="120"
          :width="10"
          color="yellow"
          indeterminate
        />
      </v-row>
      <v-row
        justify="center"
      >
        Waiting for data to load...
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Simulation from '@/data/simulation';
import Render3D from '@/components/Render3D.vue';
import Plot2D from '@/components/Plot2D.vue';
import SelectedPointPanel from '@/components/SelectedPointPanel.vue';

export default {
  name: 'ViewerPage',
  components: {
    Plot2D,
    Render3D,
    SelectedPointPanel,
  },
  props: {
    simulationFolder: {
      type: Object,
      required: true,
    },
  },
  data() {
    const simulation = new Simulation(this.simulationFolder._id);
    simulation.update();
    return {
      playing: false,
      timeStep: 0,
      timeStepShowDuration: 1000,
      selectedPointInfo: {},
      simulation,
    };
  },
  computed: {
    progress() {
      return (this.simulationFolder.nli || {}).progress || 0;
    },
    simulationId() {
      return this.simulationFolder._id;
    },
    numberOfTimeSteps() {
      return this.simulation.timeSteps.length;
    },
    times() {
      // TODO: get time information from file
      const length = this.numberOfTimeSteps;
      return Array.from({ length }, (v, k) => k + 1);
    },
    chartData() {
      return {
        labels: this.times,
        datasets: [
          this.spores,
          this.macrophages,
          this.neutrophils,
        ],
      };
    },
    spores() {
      const color = 'rgb(92, 235, 53)';
      return {
        label: 'A.Fumigatus',
        data: this.simulation.timeSteps.map((t) => t.spore.getNumberOfPoints()),
        borderColor: color,
        backgroundColor: color,
        fill: false,
      };
    },
    macrophages() {
      const color = 'rgb(255, 99, 132)';
      return {
        label: 'Macrophage',
        data: this.simulation.timeSteps.map((t) => t.macrophage.getNumberOfPoints()),
        borderColor: color,
        backgroundColor: color,
        fill: false,
      };
    },
    neutrophils() {
      const color = 'rgb(58, 0, 252)';
      return {
        label: 'Neutrophil',
        data: this.simulation.timeSteps.map((t) => t.neutrophil.getNumberOfPoints()),
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
    progress() {
      this.simulation.update();
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

.full-screen-progress {
  height: calc(100vh - 112px);
  background: white;
}
</style>
