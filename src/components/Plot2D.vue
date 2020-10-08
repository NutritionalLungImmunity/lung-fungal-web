<template>
  <div class="plot-container">
    <canvas ref="canvas" />
  </div>
</template>

<script>
import Chart from 'chart.js';

export default {
  name: 'Plot2D',
  props: {
    chartData: {
      type: Object,
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
  },
  mounted() {
    this.chart = new Chart(
      this.$refs.canvas,
      {
        type: 'line',
        data: this.chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          ...this.options,
        },
      },
    );
  },
};
</script>
