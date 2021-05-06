<template>
  <div v-if="experiment.nli">
    <div
      v-for="(status, simId, index) in experiment.nli.per_sim_status"
      :key="simId"
    >
      <v-progress-linear
        :indeterminate="indeterminate[index]"
        :color="progressColor[index]"
        :value="progress[index]"
      />
    </div>
  <!-- <v-progress-circular
    v-else
    :indeterminate="indeterminate"
    :color="progressColor"
    :value="progress"
    :size="20"
  /> -->
  </div>
</template>

<script>
/*
From girder:

class JobStatus:
    INACTIVE = 0
    QUEUED = 1
    RUNNING = 2
    SUCCESS = 3
    ERROR = 4
    CANCELED = 5
*/
export default {
  props: {
    experiment: {
      type: Object,
      required: true,
    },
    // circular: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  computed: {
    complete() {
      return this.experiment.nli.complete;
    },
    indeterminate() {
      const numSubSims = Object.keys(this.experiment.nli.per_sim_progress).length;

      if (this.complete) {
        return Array(numSubSims).fill(true);
      }
      return Object.values(this.experiment.nli.per_sim_status)
        .map((status) => status === 0 || status === 1);
    },
    progress() {
      const numSubSims = Object.keys(this.experiment.nli.per_sim_progress).length;
      if (this.complete) {
        return Array(numSubSims).fill(100);
      }
      const perSimProgress = Object.values(this.experiment.nli.per_sim_progress);
      return perSimProgress;
    },
    progressColor() {
      const numSubSims = Object.keys(this.experiment.nli.per_sim_progress).length;
      if (this.experiment.nli.complete) {
        return Array(numSubSims).fill('green');
      }
      const progressColors = Object.values(this.experiment.nli.per_sim_status).map((status) => {
        switch (status) {
          case 0:
          case 1:
            return 'yellow';
          case 2:
            return 'primary';
          case 3:
            return 'green';
          case 4:
          case 5:
            return 'red';
          default:
            return 'primary';
        }
      });
      return progressColors;
    },
  },
};
</script>
