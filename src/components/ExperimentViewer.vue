<template>
  <div>
    <v-container
      class="px-5"
      fluid
    >
      <v-toolbar
        fixed
        flat
        class="list-toolbar elevation-2 mt-2"
      >
        <h2>Graph Options</h2>

        <v-divider
          vertical
          inset
          class="mx-4"
        />
        <v-btn-toggle
          v-model="graphType"
          mandatory
        >
          <v-btn>
            <v-icon>mdi-chart-timeline-variant</v-icon>
          </v-btn>
          <v-btn>
            <v-icon>mdi-poll</v-icon>
          </v-btn>
        </v-btn-toggle>
        <v-divider
          vertical
          inset
          class="mx-4"
        />
        <template v-if="graphType === 0">
          <v-switch
            v-model="connectedGraph"
            class="align-center mr-2 pt-5"
            :label="`Connect Time Series`"
            :disabled="!timeAxisPresent && timeSeriesType === 'Single'"
          />
          <v-divider
            vertical
            inset
            class="mx-4"
          />
          <template v-if="!timeAxisPresent">
            <v-select
              v-model="timeSeriesType"
              :items="['Single', 'Range']"
              label="Type"
              dense
              class="align-center mr-2 pt-5"
              style="width: 100px"
            />
            <v-row class="even-layout">
              <v-range-slider
                v-if="timeSeriesType == 'Range'"
                v-model="timeRange"
                :max="timeBounds[1]"
                :min="timeBounds[0]"
                class="align-center"
                thumb-label
              >
                <template v-slot:prepend>
                  <v-text-field
                    :value="timeRange[0]"
                    class="mt-0 pt-0"
                    hide-details
                    type="number"
                    style="width: 60px"
                    @change="$set(timeRange, 0, $event)"
                  />
                </template>
                <template v-slot:append>
                  <v-text-field
                    :value="timeRange[1]"
                    class="align-center mt-0 pt-0"
                    hide-details
                    single-line
                    thumb-label
                    type="number"
                    style="width: 60px"
                    @change="$set(timeRange, 1, $event)"
                  />
                </template>
              </v-range-slider>
              <v-slider
                v-else
                v-model="timePoint"
                :max="timeBounds[1]"
                :min="timeBounds[0]"
                :label="`Time`"
              />
            </v-row>
          </template>
        </template>
        <v-spacer />
      </v-toolbar>
      <template v-if="graphType===0">
        <v-row>
          <v-col
            id="axis-config"
            cols="5"
          >
            <axis-config
              name="Y"
              :variables="variables"
              :data-bounds="yDataBounds"
              @module-update="selectedModuleYAxis = $event"
              @variable-update="selectedVariableYAxis = $event"
              @scale-update="yAxisScale = $event"
              @range-update="yRange = $event"
            />

            <axis-config
              name="X"
              default-to-time
              :variables="variables"
              :data-bounds="xDataBounds"
              @module-update="selectedModuleXAxis = $event"
              @variable-update="selectedVariableXAxis = $event"
              @scale-update="xAxisScale = $event"
              @range-update="xRange = $event"
            />
          </v-col>

          <v-col>
            <experiment-scatter-graph
              :plot-data="graphData"
              :x-range="xRange"
              :x-scale="xAxisScale"
              :y-range="yRange"
              :y-scale="yAxisScale"
              :x-axis-module="selectedModuleXAxis"
              :x-axis-variable="selectedVariableXAxis"
              :y-axis-module="selectedModuleYAxis"
              :y-axis-variable="selectedVariableYAxis"
              :connected-graph="connectedGraph"
              :color-map="colorMap"
            />
          </v-col>
        </v-row>
      </template>
      <template v-else>
        <v-row>
          <v-col
            id="data-source-config"
            cols="4"
          >
            <experiment-bar-graph-data-source-config
              :variables="variables"
              :time-bounds="timeBounds"
              @bar-graph-variable-update="barGraphVariables = $event"
              @time-point-update="timePoint = $event"
              @bar-graph-type-update="barGraphType = $event"
            />
          </v-col>
          <v-col>
            <experiment-bar-graph
              :graphed-variables="barGraphVariables"
              :time="timePoint"
              :color-list="colorList"
              :experiment-data="experimentData"
              :plot-type="barGraphType"
            />
          </v-col>
        </v-row>
      </template>
    </v-container>
  </div>
</template>

<script>
import AxisConfig from '@/components/AxisConfig.vue';
import ExperimentScatterGraph from '@/components/ExperimentScatterGraph.vue';
import ExperimentBarGraphDataSourceConfig from '@/components/ExperimentBarGraphDataSourceConfig.vue';
import ExperimentBarGraph from '@/components/ExperimentBarGraph.vue';
import http from '@/http';

export default {
  name: 'ExperimentViewer',
  components: {
    ExperimentScatterGraph, AxisConfig, ExperimentBarGraphDataSourceConfig, ExperimentBarGraph,
  },
  props: {
    experimentFolder: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      graphType: 0,
      selectedModuleXAxis: 'time',
      selectedVariableXAxis: undefined,
      selectedModuleYAxis: undefined,
      selectedVariableYAxis: undefined,
      yRange: [0, 100], // range to graph
      yAxisScale: 0, // 0: linear, 1: logarithmic
      xRange: [0, 100], // range to graph
      xAxisScale: 0, // 0: linear, 1: logarithmic
      connectedGraph: true,
      timeRange: [0, 100],
      timePoint: 0,
      timeSeriesType: 'Range',
      colorList: [
        '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2',
        '#7f7f7f', '#bcbd22', '#17becf',
      ],
      barGraphVariables: undefined,
      barGraphType: 'box',
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
    timeBounds() {
      if (!this.experimentData || !this.experimentData.stats) return [0, 0];

      const timeMax = Math.max(...this.simIds.map((id) => {
        const simData = this.experimentData.stats[id];
        return Math.max(...Object.keys(simData).map((time) => +time));
      }));

      const timeMin = Math.min(...this.simIds.map((id) => {
        const simData = this.experimentData.stats[id];
        return Math.min(...Object.keys(simData).map((time) => +time));
      }));

      return [timeMin, timeMax];
    },
    timeAxisPresent() {
      return (!!this.selectedModuleXAxis && this.selectedModuleXAxis === 'time')
        || (!!this.selectedModuleYAxis && this.selectedModuleYAxis === 'time');
    },
    colorMap() {
      if (!this.experimentData || !this.experimentData['simulation group map']) return undefined;

      return Object.fromEntries(
        Object
          .entries(this.experimentData['simulation group map'])
          .map(([id, group]) => [id, this.colorList[group % this.colorList.length]]),
      );
    },
    xDataMax() {
      // bail with default value if data isn't loaded or the user hasn't chosen a variable
      if (!this.experimentData
          || !this.experimentData.stats
          || !this.selectedModuleXAxis
          || (this.selectedModuleXAxis !== 'time' && !this.selectedVariableXAxis)) {
        return 100; // arbitrary
      }

      if (this.selectedModuleXAxis === 'time') {
        return Math.max(...this.simIds.map((id) => {
          const simData = this.experimentData.stats[id];
          return Math.max(...Object.keys(simData).map((time) => +time));
        }));
      }
      return Math.max(...this.simIds.map((id) => {
        const simData = this.experimentData.stats[id];
        return Math.max(...Object.values(simData)
          .map((data) => data[this.selectedModuleXAxis][this.selectedVariableXAxis]));
      }));
    },
    xDataMin() {
      // bail with default value if data isn't loaded or the user hasn't chosen a variable
      if (!this.experimentData
          || !this.experimentData.stats
          || !this.selectedModuleXAxis
          || (this.selectedModuleXAxis !== 'time' && !this.selectedVariableXAxis)) {
        return 0; // arbitrary
      }

      if (this.selectedModuleXAxis === 'time') {
        return 0; // no need to compute
      }
      return Math.min(...this.simIds.map((id) => {
        const simData = this.experimentData.stats[id];
        return Math.min(...Object.values(simData)
          .map((data) => data[this.selectedModuleXAxis][this.selectedVariableXAxis]));
      }));
    },
    yDataMax() {
      // bail with default value if data isn't loaded or the user hasn't chosen a variable
      if (!this.experimentData
          || !this.experimentData.stats
          || !this.selectedModuleYAxis
          || (this.selectedModuleYAxis !== 'time' && !this.selectedVariableYAxis)) {
        return 100; // arbitrary
      }

      if (this.selectedModuleYAxis === 'time') {
        return Math.max(...this.simIds.map((id) => {
          const simData = this.experimentData.stats[id];
          return Math.max(...Object.keys(simData).map((time) => +time));
        }));
      }
      return Math.max(...this.simIds.map((id) => {
        const simData = this.experimentData.stats[id];
        return Math.max(...Object.values(simData)
          .map((data) => data[this.selectedModuleYAxis][this.selectedVariableYAxis]));
      }));
    },
    yDataMin() {
      // bail with default value if data isn't loaded or the user hasn't chosen a variable
      if (!this.experimentData
          || !this.experimentData.stats
          || !this.selectedModuleYAxis
          || (this.selectedModuleYAxis !== 'time' && !this.selectedVariableYAxis)) {
        return 0; // arbitrary
      }

      if (this.selectedModuleYAxis === 'time') {
        return 0; // no need to compute
      }
      return Math.min(...this.simIds.map((id) => {
        const simData = this.experimentData.stats[id];
        return Math.min(...Object.values(simData)
          .map((data) => data[this.selectedModuleYAxis][this.selectedVariableYAxis]));
      }));
    },
    xDataBounds() {
      return [this.xDataMin, this.xDataMax];
    },
    yDataBounds() {
      return [this.yDataMin, this.yDataMax];
    },
    simIds() {
      if (!this.experimentData || !this.experimentData.names) {
        return [];
      }
      return Object.keys(this.experimentData.names);
    },
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
    graphData() {
      // make sure that everything is selected
      if (!this.experimentData
          || !this.experimentData.stats
          || !this.selectedModuleXAxis
          || !this.selectedModuleYAxis
          || (this.selectedModuleXAxis !== 'time' && !this.selectedVariableXAxis)
          || (this.selectedModuleYAxis !== 'time' && !this.selectedVariableYAxis)) {
        return {};
      }

      if (this.selectedModuleYAxis === 'time' && this.selectedModuleXAxis === 'time') {
        return Object
          .entries(this.experimentData.stats)
          .reduce((filteredData, [simId, simData]) => {
            /* eslint no-param-reassign: ["error", { "props": false }] */
            filteredData[simId] = Object
              .entries(simData)
              .map(([timeStep]) => [parseFloat(timeStep),
                parseFloat(timeStep),
                parseFloat(timeStep)]);
            return filteredData;
          }, {});
      }

      if (this.selectedModuleXAxis === 'time') {
        return Object
          .entries(this.experimentData.stats)
          .reduce((filteredData, [simId, simData]) => {
            /* eslint no-param-reassign: ["error", { "props": false }] */
            filteredData[simId] = Object
              .entries(simData)
              .map(([timeStep, data]) => [parseFloat(timeStep),
                parseFloat(timeStep),
                data[this.selectedModuleYAxis][this.selectedVariableYAxis]]);
            return filteredData;
          }, {});
      }

      if (this.selectedModuleYAxis === 'time') {
        return Object
          .entries(this.experimentData.stats)
          .reduce((filteredData, [simId, simData]) => {
            /* eslint no-param-reassign: ["error", { "props": false }] */
            filteredData[simId] = Object
              .entries(simData)
              .map(([timeStep, data]) => [parseFloat(timeStep),
                data[this.selectedModuleXAxis][this.selectedVariableXAxis],
                parseFloat(timeStep)]);
            return filteredData;
          }, {});
      }

      // now, we know that neither axis is time, so we may have to filter by time
      // according to ranges or only a specific time step

      if (this.timeSeriesType === 'Range') {
        return Object
          .entries(this.experimentData.stats)
          .reduce((filteredData, [simId, simData]) => {
          /* eslint no-param-reassign: ["error", { "props": false }] */
            filteredData[simId] = Object
              .entries(simData)
              .filter(([timeStep]) => (this.timeRange[0] <= parseFloat(timeStep))
               && parseFloat(timeStep) <= this.timeRange[1])
              .map(([timeStep, data]) => [parseFloat(timeStep),
                data[this.selectedModuleXAxis][this.selectedVariableXAxis],
                data[this.selectedModuleYAxis][this.selectedVariableYAxis]]);
            return filteredData;
          }, {});
      }
      // assert: timeSeriesType === 'Single'
      return Object
        .entries(this.experimentData.stats)
        .reduce((filteredData, [simId, simData]) => {
          /* eslint no-param-reassign: ["error", { "props": false }] */
          filteredData[simId] = Object
            .entries(simData)
            .filter(([timeStep]) => (this.timePoint === parseFloat(timeStep)))
            .map(([timeStep, data]) => [parseFloat(timeStep),
              data[this.selectedModuleXAxis][this.selectedVariableXAxis],
              data[this.selectedModuleYAxis][this.selectedVariableYAxis]]);
          return filteredData;
        }, {});
    },
  },
};
</script>

<style scoped>

.even-slider {
   margin-top: -18px !important;
}
</style>
