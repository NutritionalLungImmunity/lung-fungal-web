<template>
  <div>
    <v-container
      class="px-5"
      fluid
    >
      <v-row>
        <v-col id="y-axis-config">
          <v-row>
            <v-select
              v-model="selectedModuleYAxis"
              :items="modules"
              label="Module"
              dense
            />
          </v-row>
          <v-row>
            <v-select
              v-model="selectedVariableYAxis"
              :items="variables[selectedModuleYAxis]"
              label="Variable"
              dense
            />
          </v-row>
        </v-col>

        <v-col>
          <v-row>
            <experiment-graph
              :plot-data="graphData"
            />
          </v-row>

          <v-row id="x-axis-config">
            <v-col class="d-flex">
              <v-select
                v-model="selectedModuleXAxis"
                :items="modules"
                label="Module"
                dense
              />
            </v-col>
            <v-col class="d-flex">
              <v-select
                v-model="selectedVariableXAxis"
                :items="variables[selectedModuleXAxis]"
                label="Variable"
                dense
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import ExperimentGraph from '@/components/ExperimentGraph.vue';
import http from '@/http';

export default {
  name: 'ExperimentViewer',
  components: { ExperimentGraph },
  props: {
    experimentFolder: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      svgWidth: 500,
      svgHeight: 500,
      maxCompleteTime: -1,
      maxPresentTime: -1,
      timeAxisPresent: true,
      selectedModuleXAxis: undefined,
      selectedVariableXAxis: undefined,
      selectedModuleYAxis: undefined,
      selectedVariableYAxis: undefined,
    };
  },
  asyncComputed: {
    experimentData: {
      async get() {
        return http.getExperiment2DData(this.experimentFolder._id);
      },
      default: undefined,
    },
  },
  computed: {
    variables() {
      //
      if (!this.experimentData || !this.experimentData.stats) {
        return { time: [] };
      }
      const simId = Object.keys(this.experimentData.stats)[0];
      const timeStep = Object.keys(this.experimentData.stats[simId])[0];
      const data = this.experimentData.stats[simId][timeStep];

      const variableDict = { time: [] };
      Object.entries(data).forEach(([moduleName, moduleData]) => {
        Object.keys(moduleData).forEach((variable) => {
          if (!variableDict[moduleName]) {
            variableDict[moduleName] = [];
          }
          variableDict[moduleName].push(variable);
        });
      });
      return variableDict;
    },
    modules() {
      return Object.keys(this.variables);
    },
    graphData() {
      if (!this.experimentData || !this.experimentData.stats) {
        return [];
      }
      // collect the data
      const simDat = Object.entries(this.experimentData.stats['60a5229490dd22798cddc4fe'])
        .map(([key, data]) => [parseFloat(key), data])
        .sort((a, b) => a - b);

      const data = simDat.map(([t, dat]) => [t, dat.fungus.count]);

      return data;
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

/* I'm bad and I feel bad */
<style>
.molecule .v-messages__message {
  color: white;
}
</style>
