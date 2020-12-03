<template>
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
            :value="sortBy"
            class="mr-1"
            dense
            hide-details
            :items="sortOptions"
            label="Sort by"
            outlined
            @change="updatePaging({ 'sortBy': $event })"
          />
          <v-tooltip
            v-if="!sortDesc"
            bottom
          >
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                v-on="on"
                @click="updatePaging({ 'sortDesc': true })"
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
                @click="updatePaging({ 'sortDesc': false })"
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
        <simulation-card
          :simulation="sim"
          @refresh="refresh"
          @view="$emit('view', $event)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SimulationCard from '@/components/SimulationCard.vue';

const sortPropertyMap = {
  Alphabetical: 'name',
  Author: 'nli.author',
  Date: 'created',
};
const WAIT_INTERVAL = 5000;

export default {
  components: {
    SimulationCard,
  },
  inject: ['girderApi', 'girderRest'],
  props: {
    sortBy: {
      type: String,
      required: true,
    },
    sortDesc: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      // set to true when destroying the component
      cancelUpdate: false,
      // set to true when refreshing all simulations to prevent race conditions
      skipNextUpdate: false,
      filters: false,
      simDialog: false,
      sortOptions: ['Alphabetical', 'Author', 'Date'],
      updateState: new Date(),
    };
  },
  asyncComputed: {
    simulations: {
      default: [],
      async get() {
        this.skipNextUpdate = true;
        return this.girderRest.listSimulations(
          sortPropertyMap[this.sortBy],
          this.sortDesc,
        );
      },
      watch: ['updateState'],
    },
  },
  mounted() {
    this.updateAllInProgress();
  },
  beforeDestroy() {
    this.cancelUpdate = true;
  },
  methods: {
    refresh() {
      this.updateState = new Date();
    },
    updatePaging(params) {
      this.$emit('paging', {
        sortBy: this.sortBy,
        sortDesc: this.sortDesc,
        ...params,
      });
    },
    async updateInProgress(index) {
      const simulation = this.simulations[index];
      if (simulation.nli.status <= 2 && !this.skipNextUpdate) {
        const data = await this.girderRest.getSimulation(simulation._id);
        if (!this.skipNextUpdate) {
          this.$set(this.simulations, index, data);
        }
      }
    },
    async updateAllInProgress() {
      await Promise.all(
        this.simulations.map((_, index) => this.updateInProgress(index)),
      );
      if (!this.cancelUpdate) {
        await new Promise((resolve) => setTimeout(resolve, WAIT_INTERVAL));
        this.skipNextUpdate = false;
        this.updateAllInProgress();
      }
    },
  },
};
</script>
