<template>
  <v-dialog
    v-model="simDialog"
    scrollable
    max-width="500px"
    transition="dialog-transition"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        color="light-blue darken-3"
        class="ml-3"
        dark
        depressed
        v-on="on"
      >
        New Simulation
        <v-spacer />
        <v-icon right>
          mdi-plus-circle
        </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline">
        New Simulation
      </v-card-title>
      <v-card-subtitle>
        Configure your new simulation below.
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
          <v-divider />
          <v-subheader class="grey--text grey lighten-4">
            Other Parameters
          </v-subheader>
          <v-list-item class="grey lighten-4 px-6">
            <v-slider
              v-model="time"
              class="time-slider"
              label="Time"
              min="1"
              max="100"
              step="1"
              thumb-label
            >
              <template v-slot:append>
                <v-text-field
                  v-model="time"
                  class="mt-0 pt-0"
                  dense
                  outlined
                  single-line
                  type="number"
                  style="width: 64px"
                />
              </template>
            </v-slider>
          </v-list-item>
        </v-list>
        <v-divider />
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
      });
      this.$emit('create');
      this.simDialog = false;
    },
  },
};
</script>
