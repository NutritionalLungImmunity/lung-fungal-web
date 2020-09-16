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
              ID: {{ sim.id }}
            </div>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-icon size="18">
              mdi-account-circle
            </v-icon>
            {{ sim.author }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-content>
</template>

<script>
export default {
  name: 'SimulationListPage',
  data() {
    return {
      filters: false,
      simulations: [
        {
          name: 'Simulation #1',
          id: '#123456',
          author: 'John Smith',
        },
        {
          name: 'Simulation #2',
          id: '#123456',
          author: 'John Smith',
        },
        {
          name: 'Simulation #3',
          id: '#123456',
          author: 'John Smith',
        },
        {
          name: 'Simulation #4',
          id: '#123456',
          author: 'John Smith',
        },
        {
          name: 'Simulation #5',
          id: '#123456',
          author: 'John Smith',
        },
        {
          name: 'Simulation #6',
          id: '#123456',
          author: 'John Smith',
        },
        {
          name: 'Simulation #7',
          id: '#123456',
          author: 'John Smith',
        },
      ],
      sortOptions: ['Alphabetical', 'Author', 'Date', 'ID'],
      sortDesc: false,
    };
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
