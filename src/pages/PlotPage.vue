<template>
  <v-app>
    <v-flex class="text-xs-center">
      <v-btn-toggle
        v-model="toggle_one"
        mandatory
      >
        <v-btn
          flat
          @click="display = 'summary'">
          Spore Health Summary
        </v-btn>
        <v-btn
          flat
          @click="display = 'health'">
          Spore Health
        </v-btn>
        <v-btn
          flat
          @click="display = 'amount'">
          Macrophage State Summary
        </v-btn>
        <v-btn
          flat
          @click="display = 'state'">
          Macrophage State
        </v-btn>
      </v-btn-toggle>
      <vue-plotly
        v-if="display === 'summary'"
        id="summary_plot"
        :data="summaryData"
        :layout="summaryLayout"
        :options="options"
      />
      <vue-plotly
        v-else-if="display === 'health'"
        id="spore_plot"
        :data="sporeData"
        :layout="sporeLayout"
        :options="options"
      />
      <vue-plotly
        v-else-if="display === 'amount'"
        id="amount_plot"
        :data="amountData"
        :layout="amountLayout"
        :options="options"
      />
      <vue-plotly
        v-else-if="display === 'state'"
        id="macrophage_plot"
        :data="macroData"
        :layout="macroLayout"
        :options="options"
      />
    </v-flex>
  </v-app>
</template>

<script>
import VuePlotly from '@statnett/vue-plotly';
import http from '@/http';

export default {
  name: 'PlotPage',
  components: {
    VuePlotly,
  },
  props: {
    rootID: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      toggle_one: 0,
      display: 'summary',
      summaryData: [],
      summaryLayout: {},
      sporeData: [],
      sporeLayout: {},
      amountData: [],
      amountLayout: {},
      macroData: [],
      macroLayout: {},
      options: {},
    };
  },
  async mounted() {
    const summaryFileData = await this.loadData('spore_aggregate.json');
    const summaryResult = this.loadSummary(summaryFileData);
    this.summaryData = summaryResult.data;
    this.summaryLayout = summaryResult.layout;
    const sporeFileData = await this.loadData('spore_healths.json');
    const sporeResult = this.loadPlot(sporeFileData, 'lines', 'Spore Health', 'Health');
    this.sporeData = sporeResult.data;
    this.sporeLayout = sporeResult.layout;
    const amountFileData = await this.loadData('macrophage_summary.json');
    const amountResult = this.loadAmount(amountFileData);
    this.amountData = amountResult.data;
    this.amountLayout = amountResult.layout;
    const macroFileData = await this.loadData('macrophage_states.json');
    const macroResult = this.loadPlot(macroFileData, 'markers', 'Macrophage State', 'State');
    this.macroData = macroResult.data;
    this.macroLayout = macroResult.layout;

    this.options = {
      displayModeBar: false,
      responsive: true,
    };
  },
  methods: {
    async loadData(fileName) {
      const item = (await http.get('item', {
        params: {
          folderId: this.rootID,
          name: fileName,
        },
      })).data[0];

      const file = (await http.get(`item/${item._id}/files`)).data[0];

      return (await http.get(`file/${file._id}/download`)).data;
    },
    loadSummary(datapoints) {
      const data = [
        {
          x: datapoints.x,
          y: datapoints.min,
          mode: 'none',
          type: 'scatter',
          fill: 'tozeroy',
          fillcolor: '#00000000',
          name: 'Minimum',
        },
        {
          x: datapoints.x,
          y: datapoints.q1,
          mode: 'lines',
          type: 'scatter',
          fill: 'tonexty',
          fillcolor: '#3afc78aa',
          name: 'Quartile 1',
          line: {
            dash: 'dot',
            color: '#008000ff',
          },
        },
        {
          x: datapoints.x,
          y: datapoints.med,
          mode: 'lines',
          type: 'scatter',
          fill: 'tonexty',
          fillcolor: '#3afc78ff',
          name: 'Median',
          line: {
            color: '#008000ff',
          },
        },
        {
          x: datapoints.x,
          y: datapoints.q3,
          mode: 'lines',
          type: 'scatter',
          fill: 'tonexty',
          fillcolor: '#3afc78ff',
          name: 'Quartile 2',
          line: {
            dash: 'dot',
            color: '#008000ff',
          },
        },
        {
          x: datapoints.x,
          y: datapoints.max,
          mode: 'none',
          type: 'scatter',
          fill: 'tonexty',
          fillcolor: '#3afc78aa',
          name: 'Maximum',
        },
      ];

      const layout = {
        xaxis: {
          title: {
            text: 'Timepoint',
          },
          dtick: 10,
        },
        yaxis: {
          title: {
            text: 'Health',
          },
          range: [Math.min(...datapoints.min) - 1, Math.max(...datapoints.max) + 1],
        },
        hovermode: 'closest',
        title: 'Spore Health Summary',
        showlegend: false,
      };

      return { data, layout };
    },
    loadAmount(datapoints) {
      const data = Object.keys(datapoints).map(state => ({
        x: datapoints[state].x,
        y: datapoints[state].y,
        name: state,
        type: 'bar',
      }));

      const layout = {
        xaxis: {
          title: {
            text: 'Timepoint',
          },
          dtick: 10,
        },
        yaxis: {
          title: {
            text: 'Amount',
          },
        },
        hovermode: 'x',
        title: 'Macrophage State Amount',
        barmode: 'stack',
        showlegend: true,
      };

      return { data, layout };
    },
    loadPlot(datapoints, mode, title, yAxisTitle) {
      const data = Object.values(datapoints).map(coords => ({
        x: coords.x,
        y: coords.y,
        mode,
        type: 'scatter',
      }));

      const layout = {
        xaxis: {
          title: {
            text: 'Timepoint',
          },
          dtick: 10,
        },
        yaxis: {
          title: {
            text: yAxisTitle,
          },
        },
        hovermode: 'closest',
        title,
        showlegend: true,
      };

      return { data, layout };
    },
  },
};
</script>

<style scoped>
.text-xs-center {
  padding-top: 15px;
}
</style>
