<template>
  <v-container class="container grey lighten-5 flex align">
    <svg
      id="graph"
      :width="svgWidth"
      :height="svgHeight"
    />
    <v-btn
      elevation="2"
      fab
    >
      <v-icon @click="printElement('graph')">
        mdi-printer
      </v-icon>
    </v-btn>
  </v-container>
</template>

<script>
import * as d3 from 'd3';

export default {
  props: {
    plotData: {
      type: Object,
      required: true,
    },
    xRange: {
      type: Array,
      required: true,
    },
    yRange: {
      type: Array,
      required: true,
    },
    xScale: {
      type: Number,
      required: true,
    },
    yScale: {
      type: Number,
      required: true,
    },
    xAxisModule: {
      type: String,
      required: true,
    },
    xAxisVariable: {
      type: String,
      required: true,
    },
    yAxisModule: {
      type: String,
      required: true,
    },
    yAxisVariable: {
      type: String,
      required: true,
    },
    connectedGraph: {
      type: Boolean,
      required: true,
    },
    colorMap: {
      type: Object,
      required: false,
      default: undefined,
    },
  },
  data: () => ({
    svgWidth: 700,
    svgHeight: 500,
  }),
  computed: {
    xLabel() {
      if (!this.xAxisModule) {
        return 'No Variable Selected';
      }
      if (this.xAxisModule === 'time') {
        return 'time';
      }
      if (!this.xAxisVariable) {
        return `Select a variable from ${this.xAxisModule}`;
      }
      return `${this.xAxisModule} ${this.xAxisVariable}`;
    },
    yLabel() {
      if (!this.yAxisModule) {
        return 'No Variable Selected';
      }
      if (this.yAxisModule === 'time') {
        return 'time';
      }
      if (!this.yAxisVariable) {
        return `Select a variable from ${this.yAxisModule}`;
      }
      return `${this.yAxisModule} ${this.yAxisVariable}`;
    },
  },
  watch: {
    plotData(pltData) {
      this.redrawSVG(
        pltData,
        this.xRange,
        this.yRange,
        this.connectedGraph,
        this.colorMap,
        this.xScale,
        this.yScale,
      );
    },
    xRange(range) {
      this.redrawSVG(
        this.plotData,
        range,
        this.yRange,
        this.connectedGraph,
        this.colorMap,
        this.xScale,
        this.yScale,
      );
    },
    yRange(range) {
      this.redrawSVG(
        this.plotData,
        this.xRange,
        range,
        this.connectedGraph,
        this.colorMap,
        this.xScale,
        this.yScale,
      );
    },
    connectedGraph(isConnected) {
      this.redrawSVG(
        this.plotData,
        this.xRange,
        this.yRange,
        isConnected,
        this.colorMap,
        this.xScale,
        this.yScale,
      );
    },
    colorMap(cMap) {
      this.redrawSVG(
        this.plotData,
        this.xRange,
        this.yRange,
        this.connectedGraph,
        cMap,
        this.xScale,
        this.yScale,
      );
    },
    xScale(xscale) {
      this.redrawSVG(
        this.plotData,
        this.xRange,
        this.yRange,
        this.connectedGraph,
        this.colorMap,
        xscale,
        this.yScale,
      );
    },
    yScale(yscale) {
      this.redrawSVG(
        this.plotData,
        this.xRange,
        this.yRange,
        this.connectedGraph,
        this.colorMap,
        this.xScale,
        yscale,
      );
    },
  },
  methods: {
    clearSVG() {
      const svg = d3
        .select('#graph');
      svg
        .selectAll('*')
        .remove();
    },
    printElement(elementId) {
      const contents = document.getElementById(elementId).outerHTML;
      const popupWindow = window.open('', '_blank', 'location=no,menubar=no,scrollbars=no,status=no,toolbar=no');
      popupWindow.document.open();
      popupWindow.document.write(`<html><head><style></style></head><body onload="window.print()">${contents}</html>`);
      popupWindow.document.close();
    },
    redrawSVG(pltData, xRange, yRange, isConnected, colorMap, xScale, yScale) {
      this.clearSVG();

      const svg = d3
        .select('#graph');

      // set the dimensions and margins of the graph
      const margin = {
        top: 20, right: 30, bottom: 30, left: 45,
      };
      const width = this.svgWidth - margin.left - margin.right;
      const height = this.svgHeight - margin.top - margin.bottom;

      svg
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform',
          `translate(${margin.left},${margin.top})`);

      // y axis
      const y = yScale === 0
        ? d3.scaleLinear()
          .domain(yRange)
          .range([height, 0])
          .nice()
        : d3.scaleLog()
          .domain([Math.max(1e-6, yRange[0]), yRange[1]]) // because it is log scale
          .range([height, 0])
          .nice();
      const yaxis = svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickSize(-width * 1.0).ticks(10));
      yaxis
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('alignment-baseline', 'hanging')
        .style('font-size', 14);
      yaxis.select('.domain').raise();

      // y axis label
      svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'hanging')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2.0)
        .text(this.yLabel);

      // x axis
      const x = xScale === 0
        ? d3.scaleLinear()
          .domain(xRange)
          .range([0, width])
          .nice()
        : d3.scaleLog()
          .domain([Math.max(1e-6, xRange[0]), xRange[1]])
          .range([0, width])
          .nice();
      const xaxis = svg.append('g')
        .attr('transform', `translate(${margin.left},${height})`)
        .call(d3.axisBottom(x).tickSize(-height * 1.0).ticks(10));
      xaxis
        .selectAll('text')
        .attr('transform', 'translate(-10,10)rotate(-90)')
        .style('text-anchor', 'end')
        .attr('alignment-baseline', 'hanging')
        .style('font-size', 14);
      xaxis.select('.domain').raise();
      // xaxis.selectAll('.tick').filter((d) => d === xRange[0]).remove();

      // x axis label
      svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'ideographic')
        .attr('x', width / 2.0 + margin.left)
        .attr('y', height + margin.top + margin.bottom)
        .text(this.xLabel);

      svg.selectAll('.tick line').attr('stroke', '#EBEBEB');

      Object.entries(pltData).forEach(([simId, simData]) => {
        const color = (!!colorMap && !!colorMap[simId]) ? colorMap[simId] : '#69b3a2';

        svg
          .append('g')
          .selectAll('circle')
          .data(simData).enter()
          .append('circle')
          .attr('transform', `translate(${margin.left},0)`)
          .attr('cx', (d) => x(d[1]))
          .attr('cy', (d) => y(d[2]))
          .attr('r', 3)
          .style('fill', color);

        if (isConnected) {
          const lineGenerator = d3.line()
            .x((d) => x(d[1]))
            .y((d) => y(d[2]));
          const pathData = lineGenerator(simData);
          svg
            .append('g')
            .append('path')
            .attr('d', pathData)
            .attr('stroke', color)
            .attr('fill', 'none')
            .attr('transform', `translate(${margin.left},0)`);
        }
      });
    },
  },
};
</script>


<style scoped>
path {fill: none; stroke: #999;}

.container {
  height: 100%;
  position: relative;
}

.center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
