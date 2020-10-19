<template>
  <v-main class="px-0">
    <v-toolbar
      app
      color="grey darken-3"
      dark
      dense
      flat
    >
      <v-tabs
        v-model="value"
        dark
        slider-color="primary"
      >
        <v-tab>
          <span>Simulation List</span>
        </v-tab>
        <v-tab>
          <span class="mr-2">test-sim-1</span>
          <v-btn
            icon
            small
          >
            <v-icon size="18">
              mdi-close-circle
            </v-icon>
          </v-btn>
        </v-tab>
        <v-tab>
          <span class="mr-2">test-sim-2</span>
          <v-btn
            icon
            small
          >
            <v-icon size="18">
              mdi-close-circle
            </v-icon>
          </v-btn>
        </v-tab>
        <v-tab>
          <span class="mr-2">test-sim-3</span>
          <v-btn
            icon
            small
          >
            <v-icon size="18">
              mdi-close-circle
            </v-icon>
          </v-btn>
        </v-tab>
      </v-tabs>
    </v-toolbar>
    <v-container
      class="px-5"
      fluid
    >
      <v-navigation-drawer
        v-model="filters"
        app
        dark
        right
        temporary
      >
        <v-toolbar
          fixed
          flat
        >
          <v-toolbar-title>
            Filters
          </v-toolbar-title>
        </v-toolbar>
        <v-divider />
        <div class="drawer-wrapper d-flex flex-column">
          <v-list dense>
            <v-list-item>
              <v-list-item-content>
                Filtering option #1
              </v-list-item-content>
              <v-list-item-action>
                <v-checkbox />
              </v-list-item-action>
            </v-list-item>
            <v-divider />
            <v-list-item>
              <v-list-item-content>
                Filtering option #2
              </v-list-item-content>
              <v-list-item-action>
                <v-checkbox />
              </v-list-item-action>
            </v-list-item>
            <v-divider />
            <v-list-item>
              <v-list-item-content>
                Filtering option #3
              </v-list-item-content>
              <v-list-item-action>
                <v-checkbox />
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <v-spacer />
          <v-footer class="pa-0">
            <v-btn
              block
              color="primary"
              depressed
              tile
              x-large
            >
              Apply Filters
            </v-btn>
          </v-footer>
        </div>
      </v-navigation-drawer>

      <v-toolbar
        class="list-toolbar elevation-2 mt-2"
      >
        <h2>Simulations</h2>
        <v-spacer />
        <v-toolbar-items class="align-center d-flex">
          <div class="sorting d-flex align-center mr-1 pr-1">
            <v-select
              v-model="sortBy"
              class="mr-1"
              dense
              hide-details
              :items="sortOptions"
              label="Sort by"
              outlined
            />
            <v-tooltip
              v-if="!sortDesc"
              bottom
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  v-on="on"
                  @click="sortDesc = true"
                >
                  <v-icon size="20">
                    mdi-sort-ascending
                  </v-icon>
                </v-btn>
              </template>
              <span>Ascending</span>
            </v-tooltip>
            <v-tooltip
              v-else
              bottom
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  v-on="on"
                  @click="sortDesc = false"
                >
                  <v-icon size="20">
                    mdi-sort-descending
                  </v-icon>
                </v-btn>
              </template>
              <span>Descending</span>
            </v-tooltip>
          </div>
          <div class="filtering">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  v-on="on"
                  @click="filters = true"
                >
                  <v-icon size="20">
                    mdi-filter-menu
                  </v-icon>
                </v-btn>
              </template>
              <span>
                Filters
              </span>
            </v-tooltip>
          </div>
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
                  @click="simDialog = false"
                >
                  Create
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar-items>
      </v-toolbar>
      <v-row class="pt-5">
        <v-col
          v-for="sim in simulations"
          :key="sim.name"
          cols="3"
        >
          <v-card class="elevation-2">
            <v-card-title class="d-flex align-center">
              {{ sim.name }}
              <v-spacer />
              <div class="caption">
                ID: {{ sim._id }}
              </div>
            </v-card-title>
            <v-divider />
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
                      {{ sim.nli.author }}
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
                          {{ formatDate(sim.created) }}
                        </div>
                        <span class="grey--text">@</span>
                        <div class="time px-2">
                          {{ formatTime(sim.created) }}
                        </div>
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
                    :href="`${girderApi}/folder/${sim._id}/download`"
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
                    @click="archiveSimulation(sim._id)"
                  >
                    <v-icon
                      color="error"
                      size="20"
                    >
                      mdi-archive
                    </v-icon>
                  </v-btn>
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
                :to="`/viewer/${sim._id}`"
              >
                View Simulation
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
const sortPropertyMap = {
  Alphabetical: 'name',
  Author: 'nli.author',
  Date: 'created',
};

export default {
  name: 'SimulationListPage',
  inject: ['girderApi', 'girderRest'],
  data() {
    return {
      filters: false,
      simDialog: false,
      sortBy: 'Date',
      sortOptions: ['Alphabetical', 'Author', 'Date'],
      sortDesc: true,
      usersCache: {},
      updateState: new Date(),
    };
  },
  asyncComputed: {
    simulations: {
      default: [],
      async get() {
        return this.girderRest.listSimulations(
          sortPropertyMap[this.sortBy],
          this.sortDesc,
        );
      },
      watch: ['updateState'],
    },
  },
  methods: {
    formatDate(d) {
      return (new Date(d).toLocaleDateString());
    },
    formatTime(d) {
      return (new Date(d).toLocaleTimeString());
    },
    async archiveSimulation(id) {
      await this.girderRest.archiveSimulation(id);
      this.updateState = new Date();
    },
  },
};
</script>

<style scoped>
.sorting {
  border-right: 1px solid #e0e0e0;
}
.drawer-wrapper {
  height: calc(100% - 65px);
}
.time-slider {
  align-items: center;
  display: flex;
}
</style>

<style>
.list-toolbar .v-toolbar__content {
  padding-right: 0;
}
</style>
