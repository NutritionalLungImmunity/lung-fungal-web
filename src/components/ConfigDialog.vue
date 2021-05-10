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
        :disabled="girderRest.user === null"
        dark
        depressed
        large
        v-on="on"
      >
        Run {{ simulationOrExperimentUpper }}
        <v-spacer />
        <v-icon right>
          mdi-chevron-right
        </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline">
        New {{ simulationOrExperimentUpper }}
      </v-card-title>
      <v-card-subtitle>
        Provide a name for your {{ simulationOrExperimentLower }}.
      </v-card-subtitle>
      <v-card-text class="pa-0">
        <v-list class="py-0">
          <v-list-item class="pt-2 px-6">
            <v-text-field
              v-model="name"
              label="Name"
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
          @click="createSimulationOrExperiment"
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
      name: 'New Simulation or Experiment',
    };
  },
  computed: {
    time() {
      return this.config.simulation.run_time;
    },
    isExperiment() {
      if (this.config.simulation && this.config.simulation.runs_per_config > 1) {
        return true;
      }

      let isExperiment = false;
      Object.entries(this.config).forEach(([, moduleParams]) => {
        Object.entries(moduleParams).forEach(([, paramValue]) => {
          if (Array.isArray(paramValue)) {
            if (paramValue.length > 1) {
              isExperiment = true;
            }
          }
        });
      });
      return isExperiment;
    },
    simulationOrExperimentUpper() {
      return this.isExperiment ? 'Experiment' : 'Simulation';
    },
    simulationOrExperimentLower() {
      return this.isExperiment ? 'experiment' : 'simulation';
    },
  },
  methods: {
    async createSimulationOrExperiment() {
      if (this.isExperiment) {
        const data = await this.girderRest.runExperiment({
          targetTime: this.time,
          name: this.name,
        }, this.config);
        // data returned is a list of jobs, one for each sub-simulation
        // each of these has the experiment's id as part of its kwargs
        this.$emit('create', { id: (data[0].kwargs || {}).experiment_id, is_experiment: true });
      } else {
        const data = await this.girderRest.runSimulation({
          targetTime: this.time,
          name: this.name,
        }, this.config);
        this.$emit('create', { id: (data.kwargs || {}).simulation_id, is_experiment: false });
      }
      this.simDialog = false;
    },
  },
};
</script>
