<template>
  <div
    id="graph-container"
    align="center"
    background-color="white"
  >
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
  </div>
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
    xLabel: {
      type: String,
      required: true,
    },
    yLabel: {
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
  watch: {
    plotData(pltData) {
      this.redrawSVG(pltData, this.xRange, this.yRange, this.connectedGraph, this.colorMap);
    },
    xRange(range) {
      this.redrawSVG(this.plotData, range, this.yRange, this.connectedGraph, this.colorMap);
    },
    yRange(range) {
      this.redrawSVG(this.plotData, this.xRange, range, this.connectedGraph, this.colorMap);
    },
    connectedGraph(isConnected) {
      this.redrawSVG(this.plotData, this.xRange, this.yRange, isConnected, this.colorMap);
    },
    colorMap(cMap) {
      this.redrawSVG(this.plotData, this.xRange, this.yRange, this.connectedGraph, cMap);
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
    redrawSVG(pltData, xRange, yRange, isConnected, colorMap) {
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
      const y = d3.scaleLinear()
        .domain(yRange)
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
        .attr('transform', 'rotate(-90)')
        .attr('alignment-baseline', 'hanging')
        .attr('x', -height / 2.0)
        .text(this.yLabel);

      // x axis
      const x = d3.scaleLinear()
        .domain(xRange)
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
path {fill: none;stroke: #999;}
</style>
