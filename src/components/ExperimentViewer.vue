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
        <v-spacer />
        <v-switch
          v-model="connectedGraph"
          class="align-center mr-2 pt-5"
          :label="`Connect Time Series`"
        />
        <v-spacer />
        <template v-if="!timeAxisPresent">
          <v-select
            v-model="timeSeriesType"
            :items="['Single', 'Range']"
            label="Type"
            dense
          />
          <v-range-slider
            v-if="timeSeriesType == 'Range'"
            v-model="timeRange"
            :max="timeBounds[1]"
            :min="timeBounds[0]"
          >
            <template v-slot:prepend>
              <v-text-field
                :value="timeRange[0]"
                class="mt-0 pt-0"
                hide-details
                single-line
                type="number"
                style="width: 60px"
                @change="$set(timeRange, 0, $event)"
              />
            </template>
            <template v-slot:append>
              <v-text-field
                :value="timeRange[1]"
                class="mt-0 pt-0"
                hide-details
                single-line
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
        </template>
        <v-spacer />
        <!--
        Options <br>
        Connected vs Not <br>
        Here we will have a list of all the experimental groupings,
        each with a selected color, represented as (for example) a
        solid circle of the appropriate color. "Group 1", "Group 2",
        etc. Mousing over them gives a tooltip with their experimental
        options and clicking on them brings up the color picker.
        Default colors should be selected from some standard set. -->
        <!-- <v-color-picker
                  dot-size="8"
                  show-swatches
                  swatches-max-height="100"
                /> -->
      </v-toolbar>
      <v-row>
        <v-col
          id="axis-config"
          cols="4"
        >
          <!-- configuration for y-axis -->

          <v-card class="ma-2">
            <v-card-title>
              Y axis configuration
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col>
                  <v-card>
                    <v-card-title>
                      Data Source
                    </v-card-title>
                    <v-card-text>
                      <v-select
                        v-model="selectedModuleYAxis"
                        :items="modules"
                        label="Module"
                        dense
                      />
                      <v-select
                        v-model="selectedVariableYAxis"
                        :items="variables[selectedModuleYAxis]"
                        :disabled="!selectedModuleYAxis || selectedModuleYAxis === 'time'"
                        label="Variable"
                        dense
                      />
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col>
                  <v-card>
                    <v-card-text>
                      <v-btn-toggle
                        v-model="yAxisScale"
                        align="center"
                        mandatory
                      >
                        <v-btn>
                          Linear
                        </v-btn>
                        <v-btn>
                          Logarithmic
                        </v-btn>
                      </v-btn-toggle>
                      <v-switch
                        v-model="yAxisAutoBounds"
                        :label="`Automatic bounds`"
                      />
                      <v-range-slider
                        v-if="!yAxisAutoBounds"
                        v-model="yRange"
                        :max="yBounds[1]"
                        :min="yBounds[0]"
                      >
                        <template v-slot:prepend>
                          <v-text-field
                            :value="yRange[0]"
                            class="mt-0 pt-0"
                            hide-details
                            single-line
                            type="number"
                            style="width: 60px"
                            @change="$set(yRange, 0, $event)"
                          />
                        </template>
                        <template v-slot:append>
                          <v-text-field
                            :value="yRange[1]"
                            class="mt-0 pt-0"
                            hide-details
                            single-line
                            type="number"
                            style="width: 60px"
                            @change="$set(yRange, 1, $event)"
                          />
                        </template>
                      </v-range-slider>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- configuration for x-axis -->
          <v-card class="ma-2">
            <v-card-title>
              X axis configuration
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col>
                  <v-card
                    outlined
                    class=".rounded-0"
                  >
                    <!-- x-axis data source -->
                    <v-card-title>
                      Data Source
                    </v-card-title>
                    <v-card-text>
                      <v-select
                        v-model="selectedModuleXAxis"
                        :items="modules"
                        label="Module"
                        dense
                      />
                      <v-select
                        v-model="selectedVariableXAxis"
                        :items="variables[selectedModuleXAxis]"
                        :disabled="selectedModuleXAxis === 'time'"
                        label="Variable"
                        dense
                      />
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col>
                  <v-card
                    outlined
                  >
                    <v-card-text>
                      <v-btn-toggle
                        v-model="xAxisScale"
                        align="center"
                        mandatory
                      >
                        <v-btn>
                          Linear
                        </v-btn>
                        <v-btn>
                          Logarithmic
                        </v-btn>
                      </v-btn-toggle>
                      <v-switch
                        v-model="xAxisAutoBounds"
                        :label="`Automatic bounds`"
                      />
                      <v-range-slider
                        v-if="!xAxisAutoBounds"
                        v-model="xRange"
                        :max="xBounds[1]"
                        :min="xBounds[0]"
                      >
                        <template v-slot:prepend>
                          <v-text-field
                            :value="xRange[0]"
                            class="mt-0 pt-0"
                            hide-details
                            single-line
                            type="number"
                            style="width: 60px"
                            @change="$set(xRange, 0, $event)"
                          />
                        </template>
                        <template v-slot:append>
                          <v-text-field
                            :value="xRange[1]"
                            class="mt-0 pt-0"
                            hide-details
                            single-line
                            type="number"
                            style="width: 60px"
                            @change="$set(xRange, 1, $event)"
                          />
                        </template>
                      </v-range-slider>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col>
          <experiment-graph
            :plot-data="graphData"
            :x-range="xRange"
            :x-scale="xAxisScale"
            :y-range="yRange"
            :y-scale="yAxisScale"
            :x-label="xLabel"
            :y-label="yLabel"
            :connected-graph="connectedGraph"
            :color-map="colorMap"
          />
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
      panels: [0, 1],
      svgWidth: 500,
      svgHeight: 500,
      selectedModuleXAxis: 'time',
      selectedVariableXAxis: undefined,
      selectedModuleYAxis: undefined,
      selectedVariableYAxis: undefined,
      yAxisAutoBounds: true,
      yRange: [0, 100], // range to graph
      yBounds: [0, 100], // hard bounds for the range
      yAxisScale: 0, // 0: linear, 1: logarithmic
      xAxisAutoBounds: true,
      xRange: [0, 100], // range to graph
      xBounds: [0, 100], // hard bounds for the range
      xAxisScale: 0, // 0: linear, 1: logarithmic
      connectedGraph: true,
      timeRange: [0, 100],
      timePoint: 0,
      timeSeriesType: 'Range',
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

      // TODO: what if there are more than 10 groups?
      const bigColorList = [
        '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2',
        '#7f7f7f', '#bcbd22', '#17becf',
      ];

      return Object.fromEntries(
        Object
          .entries(this.experimentData['simulation group map'])
          .map(([id, group]) => [id, bigColorList[group % bigColorList.length]]),
      );
    },
    xLabel() {
      if (!this.selectedModuleXAxis) {
        return 'No Variable Selected';
      }
      if (this.selectedModuleXAxis === 'time') {
        return 'time';
      }
      if (!this.selectedVariableXAxis) {
        return `Select a variable from ${this.selectedModuleXAxis}`;
      }
      return `${this.selectedModuleXAxis} ${this.selectedVariableXAxis}`;
    },
    yLabel() {
      if (!this.selectedModuleYAxis) {
        return 'No Variable Selected';
      }
      if (this.selectedModuleYAxis === 'time') {
        return 'time';
      }
      if (!this.selectedVariableYAxis) {
        return `Select a variable from ${this.selectedModuleYAxis}`;
      }
      return `${this.selectedModuleYAxis} ${this.selectedVariableYAxis}`;
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
    modules() {
      return Object.keys(this.variables);
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
  watch: {
    xDataMax(dataMax) {
      // allow you to go up a bit above the max
      const ub = dataMax + 0.1 * (dataMax - this.xDataMin);
      this.xRange[1] = dataMax;
      this.xBounds[1] = ub;
    },
    xDataMin(dataMin) {
      // allow you to go up a bit below the min; allow 0
      const lb = this.xDataMin - 0.1 * (this.xDataMax - dataMin);
      this.xRange[0] = dataMin;
      this.xBounds[0] = Math.min(0, lb);
    },
    yDataMax(dataMax) {
      // allow you to go up a bit above the max
      const ub = dataMax + 0.1 * (dataMax - this.yDataMin);
      this.yRange[1] = dataMax;
      this.yBounds[1] = ub;
    },
    yDataMin(dataMin) {
      // allow you to go up a bit below the min; allow 0
      const lb = this.yDataMin - 0.1 * (this.yDataMax - dataMin);
      this.yRange[0] = dataMin;
      this.yBounds[0] = Math.min(0, lb);
    },
    selectedModuleYAxis(selectedModule) {
      if (selectedModule === 'time') {
        this.selectedVariableYAxis = undefined;
      }
    },
    selectedModuleXAxis(selectedModule) {
      if (selectedModule === 'time') {
        this.selectedVariableXAxis = undefined;
      }
    },
    yAxisAutoBounds(autobounds) {
      if (autobounds) {
        this.yRange = [this.yDataMin, this.yDataMax];
      }
    },
    xAxisAutoBounds(autobounds) {
      if (autobounds) {
        this.xRange = [this.xDataMin, this.xDataMax];
      }
    },
  },
};
</script>
