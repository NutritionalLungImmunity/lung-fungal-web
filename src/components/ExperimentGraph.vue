<template>
  <div
    id="graph-container"
    align="center"
  >
    <svg
      id="graph"
      :width="svgWidth"
      :height="svgHeight"
    />
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
  },
  data: () => ({
    svgWidth: 500,
    svgHeight: 500,
  }),
  watch: {
    plotData(pltData) {
      this.redrawSVG(pltData, this.xRange, this.yRange);
    },
    xRange(range) {
      this.redrawSVG(this.plotData, range, this.yRange);
    },
    yRange(range) {
      this.redrawSVG(this.plotData, this.xRange, range);
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
    redrawSVG(pltData, xRange, yRange) {
      this.clearSVG();

      const svg = d3
        .select('#graph');

      // set the dimensions and margins of the graph
      const margin = {
        top: 10, right: 30, bottom: 30, left: 40,
      };
      const width = this.svgWidth - margin.left - margin.right;
      const height = this.svgHeight - margin.top - margin.bottom;

      svg
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform',
          `translate(${margin.left},${margin.top})`);

      // Add X axis
      const x = d3.scaleLinear()
        .domain(xRange)
        .range([0, width]);
      svg.append('g')
        .attr('transform', `translate(${margin.left},${height})`)
        .call(d3.axisBottom(x));

      // Add Y axis
      const y = d3.scaleLinear()
        .domain(yRange)
        .range([height, 0]);
      svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

      Object.entries(pltData).forEach(([, simData]) => {
        svg
          .append('g')
          .selectAll('circle')
          .data(simData).enter()
          .append('circle')
          .attr('transform', `translate(${margin.left},0)`)
          .attr('cx', (d) => x(d[1]))
          .attr('cy', (d) => y(d[2]))
          .attr('r', 4)
          .style('fill', '#69b3a2');
      });
    },
  },
};
</script>
