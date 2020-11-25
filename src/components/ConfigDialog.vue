<template>
  <v-dialog
    v-model="simDialog"
    scrollable
    max-width="500px"
    transition="dialog-transition"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        color="primary"
        class="ml-3"
        dark
        depressed
        large
        v-on="on"
      >
        Run Simulation
        <v-spacer />
        <v-icon right>
          mdi-chevron-right
        </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline">
        New Simulation
      </v-card-title>
      <v-card-subtitle>
        Provide a name for your simulation.
      </v-card-subtitle>
      <v-card-text class="pa-0">
        <v-list class="py-0">
          <v-list-item class="pt-2 px-6">
            <v-text-field
              v-model="name"
              label="Simulation Name"
              outlined
            />
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions class="pa-6">
        <v-spacer />
        <v-btn
          color="grey darken-3"
          text
          @click="simDialog = false"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          depressed
          @click="createSimulation"
        >
          Create
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    config: {
      type: Object,
      required: true,
    },
  },
  inject: ['girderRest'],
  data() {
    return {
      simDialog: false,
      time: 20,
      name: 'New Simulation',
    };
  },
  methods: {
    async createSimulation() {
      await this.girderRest.runSimulation({
        targetTime: this.time,
        name: this.name,
      }, this.config);
      this.$emit('create');
      this.simDialog = false;
    },
  },
};
</script>
