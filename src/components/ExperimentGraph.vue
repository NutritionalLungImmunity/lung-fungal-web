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
      type: Array,
      required: true,
    },
  },
  data: () => ({
    svgWidth: 500,
    svgHeight: 500,
  }),
  watch: {
    plotData(data) {
      this.clearSVG();

      const svg = d3
        .select('#graph');

      // set the dimensions and margins of the graph
      const margin = {
        top: 10, right: 30, bottom: 40, left: 50,
      };
      // const width = 520 - margin.left - margin.right;
      // const height = 520 - margin.top - margin.bottom;

      svg
        .append('g')
        .attr('transform',
          `translate(${margin.left},${margin.top})`);

      svg
        .selectAll('circle')
        .data(data).enter()
        .append('circle')
        .attr('cx', (d) => d[0])
        .attr('cy', (d) => d[1])
        .attr('r', 4);

    //   svg.append('g')
    //     .attr('class', 'x axis')
    //     .attr('transform', `translate(0,${height})`)
    //     .call(xAxis)
    //     .append('text')
    //     .attr('class', 'label')
    //     .attr('x', width)
    //     .attr('y', -6)
    //     .style('text-anchor', 'end')
    //     .text('label');
    },
  },
  methods: {
    clearSVG: () => {
      const svg = d3
        .select('#graph');
      svg
        .selectAll('*')
        .remove();
    },
  },
};
</script>
