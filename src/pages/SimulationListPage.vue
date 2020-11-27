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
    <simulation-list-tab
      @view="viewSimulation($event)"
    />
  </v-main>
</template>

<script>
import SimulationListTab from '@/components/SimulationListTab.vue';

export default {
  name: 'SimulationListPage',
  components: {
    SimulationListTab,
  },
  data() {
    return {
      currentTab: '_simulationList',
      tabs: [],
    };
  },
  methods: {
    viewSimulation(simulation) {
      const id = simulation._id;
      let tab = this.tabs.filter((t) => t._id === id)[0];
      if (!tab) {
        tab = simulation;
        this.tabs.push(tab);
      }
      this.currentTab = tab.id;
    },
    closeTab(id) {
      this.tabs = this.tabs.filter((tab) => tab._id !== id);
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
