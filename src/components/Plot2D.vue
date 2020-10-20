<template>
  <div class="plot-container">
    <canvas ref="canvas" />
  </div>
</template>

<script>
import Chart from 'chart.js';
import * as ChartAnnotation from 'chartjs-plugin-annotation';

export default {
  name: 'Plot2D',
  props: {
    chartData: {
      type: Object,
      required: true,
    },
    time: {
      type: Number,
      required: true,
    },
    options: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  watch: {
    chartData() {
      if (this.chart) {
        this.chart.update();
      }
    },
    time() {
      if (this.chart) {
        this.chart.annotation.elements.time.options.value = this.time;
        this.chart.update();
      }
    },
  },
  mounted() {
    this.chart = new Chart(
      this.$refs.canvas,
      {
        type: 'line',
        data: this.chartData,
        plugins: [ChartAnnotation],
        options: {
          animation: {
            duration: 0,
          },
          responsive: true,
          maintainAspectRatio: false,
          annotation: {
            annotations: [{
              id: 'time',
              type: 'line',
              mode: 'vertical',
              scaleID: 'x-axis-0',
              value: this.time,
              borderColor: 'black',
              borderWidth: 2,
            }],
          },
          ...this.options,
        },
      },
    );
  },
};
</script>
