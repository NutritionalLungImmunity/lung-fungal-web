<template>
  <v-card class="elevation-2">
    <v-card-title class="d-flex align-center">
      {{ simulation.name }}
      <v-spacer />
      <div class="caption">
        ID: {{ simulation._id }}
      </div>
    </v-card-title>
    <v-divider />
    <simulation-progress-bar :simulation="simulation" />
    <v-alert
      class="ma-0 sim-card-alert"
      color="error"
      dense
      icon="mdi-alert-rhombus"
      prominent
      tile
      type="error"
      :value="false"
    >
      <v-row align="center">
        <v-col class="grow">
          An error has occured
        </v-col>
        <v-col class="shrink">
          <v-btn
            outlined
            small
          >
            Learn More
          </v-btn>
        </v-col>
      </v-row>
    </v-alert>
    <v-card-text class="pa-0">
      <v-list
        class="pa-0"
        color="grey lighten-5"
        dense
      >
        <!-- Author -->
        <v-list-item>
          <v-list-item-icon class="mr-2">
            <v-icon size="20">
              mdi-account-circle
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              {{ simulation.nli.author }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <!-- Date Time -->
        <v-list-item>
          <v-list-item-icon class="mr-2">
            <v-icon size="20">
              mdi-calendar
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              <div class="d-flex">
                <div class="date pr-2">
                  {{ formatDate(simulation.created) }}
                </div>
                <span class="grey--text">@</span>
                <div class="time px-2">
                  {{ formatTime(simulation.created) }}
                </div>
                <template v-if="simulation.nli.version">
                  <span class="grey--text">#</span>
                  <div class="px-2">
                    <a href="https://github.com/NutritionalLungImmunity/nlisim/releases">{{ simulation.nli.version }}</a>
                  </div>
                </template>
              </div>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            small
            text
            :href="`${girderApi}/folder/${simulation._id}/download`"
            v-on="on"
          >
            <v-icon
              color="gray darken-1"
              size="20"
            >
              mdi-download
            </v-icon>
          </v-btn>
        </template>
        <span>
          Download Simulation
        </span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            small
            text
            v-on="on"
          >
            <v-icon
              color="gray darken-1"
              size="20"
            >
              mdi-share
            </v-icon>
          </v-btn>
        </template>
        <span>
          Share Simulation
        </span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            small
            text
            v-on="on"
            @click="rerunSimulation"
          >
            <v-icon
              size="20"
            >
              mdi-open-in-new
            </v-icon>
          </v-btn>
        </template>
        <span>
          Rerun
        </span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-hover v-slot:default="{ hover }">
            <v-btn
              icon
              small
              text
              v-on="on"
              @click="archiveSimulation(simulation._id)"
            >
              <v-icon
                v-if="hover"
                color="error"
                size="20"
              >
                mdi-archive
              </v-icon>
              <v-icon
                v-else
                size="20"
              >
                mdi-archive
              </v-icon>
            </v-btn>
          </v-hover>
        </template>
        <span>
          Archive
        </span>
      </v-tooltip>
      <v-spacer />
      <v-btn
        color="primary"
        small
        text
        @click="viewSimulation(simulation._id)"
      >
        View Simulation
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import SimulationProgressBar from '@/components/SimulationProgressBar.vue';

export default {
  inject: ['girderApi', 'girderRest'],
  components: {
    SimulationProgressBar,
  },
  props: {
    simulation: {
      type: Object,
      required: true,
    },
  },
  methods: {
    viewSimulation() {
      this.$emit('view', this.simulation);
    },
    formatDate(d) {
      return (new Date(d).toLocaleDateString());
    },
    formatTime(d) {
      return (new Date(d).toLocaleTimeString());
    },
    async archiveSimulation() {
      await this.girderRest.archiveSimulation(this.simulation._id);
      this.refresh();
    },
    refresh() {
      this.$emit('refresh', this.simulation);
    },
    rerunSimulation() {
      let { config } = this.simulation.nli;
      if (config.config) {
        // TODO: Figure out why the config gets nested like this.
        config = config.config;
      }
      const query = {
        ...this.$route.query,
        initialValues: JSON.stringify(config),
      };
      this.$router.push({ path: 'configure', query });
    },
  },
};
</script>

<style>
.sim-card-alert .v-alert__icon {
  font-size: 26px !important;
  margin-right: 5px;
}
.sim-card-alert .v-alert__icon:after {
  display: none;
}
</style>
