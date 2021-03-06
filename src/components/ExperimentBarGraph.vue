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
    graphedVariables: {
      type: Array,
      default() { return []; },
    },
    time: {
      type: Number,
      default: 0,
    },
    experimentData: {
      type: Object,
      default: undefined,
    },
    colorList: {
      type: Array,
      required: false,
      default: undefined,
    },
    plotType: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    svgWidth: 700,
    svgHeight: 500,
    perturbPoints: true,
  }),
  computed: {
    numExperimentalGroups() {
      if (!this.experimentData) return 0;

      return 1 + Math.max(...Object.values(this.experimentData['simulation group map']));
    },
    plotData() {
      if (!this.experimentData) return [[]];
      // returns an array of arrays
      // first coordinate is the experimental group number
      // second coordinate is the variable number (corresponding to index in the
      // variables prop)

      // this is just some nonsense to make sure reactivity works
      const { graphedVariables, numExperimentalGroups, experimentData } = this;

      const plotData = [];
      for (let expIndex = 0; expIndex < numExperimentalGroups; expIndex += 1) {
        // create a per experiment list
        plotData.push([]);
        for (let varIndex = 0; varIndex < graphedVariables.length; varIndex += 1) {
          // collect the data
          const dataSet = [];
          Object.entries(experimentData.stats).forEach(([simId, stats]) => {
            if (experimentData['simulation group map'][simId] !== expIndex) return;

            // find the right data point, keys are unfortunately strings...
            //
            Object.entries(stats).forEach(([timeString, dataPoint]) => {
              if (parseFloat(timeString) === this.time) {
                const v = this.graphedVariables[varIndex];
                dataSet.push(dataPoint[v.module][v.variable]);
              }
            });
          });
          // create a statistics object
          const trueMin = d3.min(dataSet);
          const q1 = d3.quantile(dataSet, 0.25);
          const median = d3.median(dataSet);
          const q3 = d3.quantile(dataSet, 0.75);
          const trueMax = d3.max(dataSet);
          const iqr = q3 - q1;
          const ub = q3 + 1.5 * iqr;
          const lb = q1 - 1.5 * iqr;
          const mean = d3.mean(dataSet);
          const stdev = d3.deviation(dataSet);
          const stats = {
            trueMin,
            q1,
            median,
            q3,
            trueMax,
            iqr,
            mean,
            stdev,
            dataSet,
            iqrMin: Math.min(q1, ...dataSet.filter((d) => d >= lb)),
            iqrMax: Math.max(q3, ...dataSet.filter((d) => d <= ub)),
            outliers: dataSet.filter((d) => d < lb || d > ub),
          };
          plotData[expIndex].push(stats);
        }
      }
      return plotData;
    },
  },
  watch: {
    plotData(newPlotData) {
      this.redrawSVG(newPlotData);
    },
    plotType() {
      this.redrawSVG(this.plotData);
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
    reorder(i) {
      const experimentNumber = Math.floor(i / this.graphedVariables.length);
      const variableNumber = i % this.graphedVariables.length;
      return experimentNumber + variableNumber * this.numExperimentalGroups;
    },
    printElement(elementId) {
      const contents = document.getElementById(elementId).outerHTML;
      const popupWindow = window.open('', '_blank', 'location=no,menubar=no,scrollbars=no,status=no,toolbar=no');
      popupWindow.document.open();
      popupWindow.document.write(`<html><head><style></style></head><body onload="window.print()">${contents}</html>`);
      popupWindow.document.close();
    },
    redrawSVG(plotdata) {
      this.clearSVG();

      // find the range
      const yRange = plotdata.reduce(
        (minmax, experiment) => {
          const [expMin, expMax] = experiment.reduce(
            (expminmax, data) => [
              Math.min(
                data.trueMin,
                this.plotType === 'bar' ? data.mean - 1.96 * data.stdev : Number.POSITIVE_INFINITY,
                expminmax[0],
              ),
              Math.max(
                data.trueMax,
                this.plotType === 'bar' ? data.mean + 1.96 * data.stdev : Number.NEGATIVE_INFINITY,
                expminmax[1],
              )],
            [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY],
          );
          return [
            Math.min(expMin, minmax[0]),
            Math.max(expMax, minmax[1]),
          ];
        }, [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY],
      );
      if (this.plotType === 'bar') yRange[0] = Math.min(0, yRange[0]);

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

      svg.selectAll('.tick line').attr('stroke', '#EBEBEB');

      const x = d3.scaleBand()
        .domain(d3.range(this.numExperimentalGroups * this.graphedVariables.length))
        .range([margin.left, width - margin.right])
        .padding(0.1);

      const g = svg.append('g')
        .selectAll('g')
        .data([].concat(...plotdata)) // flatten (i,j) -> i * lenJ + j
        .join('g');

      // main box
      g.append('rect')
        .attr('fill', (d, i) => {
          if (!this.colorList) return 'steelblue';
          const experimentNumber = Math.floor(i / this.graphedVariables.length);
          return this.colorList[experimentNumber % this.colorList.length];
        })
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        // .attr('x', (d, i) => x(i)) // group by experiment
        .attr('x', (d, i) => x(this.reorder(i))) // group by variable
        .attr('y', (d) => (this.plotType === 'box' ? y(d.q3) : y(d.mean)))
        .attr('height', (d) => (this.plotType === 'box' ? y(d.q1) - y(d.q3) : y(0) - y(d.mean)))
        .attr('width', x.bandwidth());

      // median line
      if (this.plotType === 'box') {
        g.append('path')
          .attr('d', (d, i) => `M${x(this.reorder(i))} ${y(d.median)} H${x(this.reorder(i)) + x.bandwidth()}`)
          .attr('stroke', 'black')
          .attr('stroke-width', 2);
      }

      // top whisker
      const twBase = (d) => (this.plotType === 'box' ? y(d.q3) : y(d.mean));
      const twTop = (d) => (this.plotType === 'box' ? y(d.iqrMax) : y(d.mean + 1.96 * d.stdev)); // TODO: t-test
      g.append('path')
        .attr('d', (d, i) => `
         M${x(this.reorder(i)) + x.bandwidth() * 0.5} ${twBase(d)}
         V${twTop(d)}
         H${x(this.reorder(i)) + x.bandwidth() * 0.25}
         H${x(this.reorder(i)) + x.bandwidth() * 0.75}`)
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('fill', 'none');

      // bottom whisker
      const bwBase = (d) => (this.plotType === 'box' ? y(d.q1) : y(d.mean));
      const bwBottom = (d) => (this.plotType === 'box' ? y(d.iqrMin) : y(d.mean - 1.96 * d.stdev)); // TODO: t-test
      g.append('path')
        .attr('d', (d, i) => `
         M${x(this.reorder(i)) + x.bandwidth() * 0.5} ${bwBase(d)}
         V${bwBottom(d)}
         H${x(this.reorder(i)) + x.bandwidth() * 0.25}
         H${x(this.reorder(i)) + x.bandwidth() * 0.75}`)
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .attr('fill', 'none');

      // outliers
      const random = d3.randomNormal(0, x.bandwidth() / 16);
      svg.append('g')
        .selectAll('g')
        .data([].concat(...plotdata)) // flatten (i,j) -> i * lenJ + j
        .join('g')
        .attr('transform', (d, i) => `translate(${x(this.reorder(i)) + x.bandwidth() / 2},0)`)
        .selectAll('circle')
        .data((d) => d.dataSet) // d.outliers)
        .join('circle')
        .attr('cy', (d) => y(d))
        .attr('cx', () => (!this.perturbPoints ? 0
          : Math.max(-x.bandwidth() / 8, Math.min(x.bandwidth() / 8, random()))))
        .attr('r', 5)
        .attr('fill-opacity', 0.5)
        .attr('fill', 'grey');
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
