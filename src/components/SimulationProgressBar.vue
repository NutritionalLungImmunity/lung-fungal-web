<template>
  <v-progress-linear
    v-if="!circular"
    :indeterminate="indeterminate"
    :color="progressColor"
    :value="progress"
  />
  <v-progress-circular
    v-else
    :indeterminate="indeterminate"
    :color="progressColor"
    :value="progress"
    :size="20"
  />
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
    simulation: {
      type: Object,
      required: true,
    },
    circular: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    complete() {
      return this.simulation.nli.complete;
    },
    indeterminate() {
      const { status } = this.simulation.nli;
      return (!this.complete && status === undefined)
        || status === 0
        || status === 1;
    },
    progress() {
      const p = this.simulation.nli.progress;
      if (this.complete) {
        return 100;
      }
      return p !== undefined ? p : 0;
    },
    progressColor() {
      if (this.simulation.nli.complete) {
        return 'green';
      }
      switch (this.simulation.nli.status) {
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
    },
  },
};
</script>
