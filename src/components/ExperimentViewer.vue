<template>
  <div>
    <v-container
      class="px-5"
      fluid
    >
      Hi there!
    </v-container>
  </div>
</template>

<script>

export default {
  name: 'ExperimentViewer',
  props: {
    experimentFolder: {
      type: Object,
      required: true,
    },
  },
};
</script>
