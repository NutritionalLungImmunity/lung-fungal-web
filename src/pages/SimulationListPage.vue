<template>
  <v-content class="px-5">
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
      class="elevation-2 mt-5"
      color="primary"
      dark
    >
      <h2>Simulations</h2>
      <v-spacer />
      <v-toolbar-items class="align-center d-flex">
        <div class="sorting d-flex align-center mr-1 pr-1">
          <v-select
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
                    {{ sim.author }}
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
            >
              View Simulation
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-content>
</template>

<script>
export default {
  name: 'SimulationListPage',
  inject: ['girderRest'],
  data() {
    return {
      filters: false,
      sortOptions: ['Alphabetical', 'Author', 'Date', 'ID'],
      sortDesc: false,
      usersCache: {},
    };
  },
  asyncComputed: {
    simulations: {
      default: [],
      async get() {
        const simulations = await this.girderRest.listSimulations();
        // eslint-disable-next-line arrow-body-style
        return Promise.all(
          simulations.map((sim) => this.injectAuthor(sim, this.girderRest)),
        );
      },
    },
  },
  methods: {
    async injectAuthor(simulation, girderRest) {
      const userId = simulation.creatorId;
      if (!this.usersCache[userId]) {
        const { data } = await girderRest.get(`user/${userId}`);
        this.usersCache[userId] = `${data.firstName} ${data.lastName}`;
      }
      return {
        author: this.usersCache[userId],
        ...simulation,
      };
    },
    formatDate(d) {
      return (new Date(d).toLocaleDateString());
    },
    formatTime(d) {
      return (new Date(d).toLocaleTimeString());
    },
  },
};
</script>

<style scoped>
.sorting {
  border-right: 1px solid #5a97dc;
}
.drawer-wrapper {
  height: calc(100% - 65px);
}
</style>
