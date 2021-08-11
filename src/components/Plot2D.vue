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
  data() {
    return {
      cd: { ...this.chartData },
    };
  },
  watch: {
    chartData() {
      this.refresh();
    },
    time() {
      if (this.chart) {
        this.chart.annotation.elements.time.options.value = this.time;
        this.refresh();
      }
    },
  },
  mounted() {
    this.chart = new Chart(
      this.$refs.canvas,
      {
        type: 'line',
        data: this.cd,
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
          scales: {
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'Time (minutes)',
              },
            }],
          },
          ...this.options,
        },
      },
    );
  },
  methods: {
    refresh() {
      if (this.chart) {
        this.chartData.datasets.forEach((dataset, index) => {
          this.cd.datasets[index].data = dataset.data;
        });
        this.cd.labels = this.chartData.labels;
        this.chart.update();
      }
    },
  },
};
</script>
