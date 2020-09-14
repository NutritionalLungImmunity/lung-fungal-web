<template>
  <v-content class="px-5">
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
</style>
