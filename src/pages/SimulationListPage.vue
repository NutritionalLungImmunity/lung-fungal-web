<template>
  <v-main class="px-0">
    <v-app-bar
      color="grey darken-3"
      dark
      dense
      flat
    >
      <v-tabs
        v-model="currentTab"
        dark
        slider-color="primary"
      >
        <v-tab
          key="_simulationList"
        >
          <span>Simulation List</span>
        </v-tab>
        <v-tab
          v-for="tab in tabs"
          :key="tab._id"
        >
          <span class="mr-2">{{ tab.name }}</span>
          <v-btn
            icon
            small
          >
            <v-icon
              size="18"
              @click="closeTab(tab._id)"
            >
              mdi-close-circle
            </v-icon>
          </v-btn>
        </v-tab>
      </v-tabs>
    </v-app-bar>
    <v-tabs-items v-model="currentTab">
      <v-tab-item
        key="_simulationList"
      >
        <simulation-list-tab
          :sort-by="sortBy"
          :sort-desc="sortDescBoolean"
          @view="viewSimulation($event)"
          @paging="updatePagingRoute"
        />
      </v-tab-item>
      <v-tab-item
        v-for="simulation in tabs"
        :key="simulation._id"
      >
        <simulation-viewer :simulation-id="simulation._id" />
      </v-tab-item>
    </v-tabs-items>
  </v-main>
</template>

<script>
import { boolean } from 'boolean';

import SimulationListTab from '@/components/SimulationListTab.vue';
import SimulationViewer from '@/components/SimulationViewer.vue';

export default {
  name: 'SimulationListPage',
  components: {
    SimulationListTab,
    SimulationViewer,
  },
  props: {
    sortBy: {
      type: String,
      default: 'Date',
    },
    sortDesc: {
      type: String,
      default: 'true',
    },
  },
  data() {
    return {
      currentTab: '_simulationList',
      tabs: [],
    };
  },
  computed: {
    sortDescBoolean() {
      return boolean(this.sortDesc);
    },
  },
  methods: {
    viewSimulation(simulation) {
      const id = simulation._id;
      let tab = this.tabs.filter((t) => t._id === id)[0];
      if (!tab) {
        tab = simulation;
        this.tabs.push(tab);
      }
      this.setTab(tab._id);
    },
    setTab(simulationId) {
      this.currentTab = this.tabs.map((tab) => tab._id).indexOf(simulationId) + 1;
    },
    closeTab(id) {
      this.tabs = this.tabs.filter((tab) => tab._id !== id);
    },
    updatePagingRoute({ sortBy, sortDesc }) {
      const query = {
        ...this.$route.query,
        sortBy,
        sortDesc: sortDesc ? 'true' : 'false',
      };
      this.$router.replace({ path: 'simulations', query });
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
