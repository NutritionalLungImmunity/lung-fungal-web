<template>
  <v-main
    v-if="loaded"
    class="px-0"
  >
    <v-app-bar
      color="grey darken-3"
      dark
      dense
      flat
    >
      <v-tabs
        :value="currentTab"
        dark
        slider-color="primary"
        @change="setTabByIndex($event)"
      >
        <v-tab
          key="_experimentList"
        >
          <span>Experiment List</span>
        </v-tab>
        <v-tab
          v-for="tab in tabObjects"
          :key="tab._id"
        >
          <!-- TODO: need to monitor progress for experiment
          <simulation-progress-bar
            v-if="tab.nli.progress < 100"
            :simulation="simulationCache[tab._id]"
            :circular="true"
          /> -->
          <span class="ms-2">{{ tab.name }}</span>
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

    <v-tabs-items
      :value="currentTab"
      class="transparent"
      @change="setTabByIndex($event)"
    >
      <v-tab-item
        key="_experimentList"
      >
        <experiment-list-tab
          ref="experimentListTab"
          :sort-by="sortBy"
          :sort-desc="sortDescBoolean"
          @view="viewExperiment($event)"
          @paging="updatePagingRoute"
          @update="updateCache"
        />
      </v-tab-item>
      <v-tab-item
        v-for="tab in tabs"
        :key="tab"
      >
        <experiment-viewer :experiment-folder="experimentCache[tab]" />
      </v-tab-item>
    </v-tabs-items>
  </v-main>
</template>

<script>
import { boolean } from 'boolean';

import cache from '@/cache';
import ExperimentListTab from '@/components/ExperimentListTab.vue';
import ExperimentViewer from '@/components/ExperimentViewer.vue';

export default {
  name: 'ExperimentListPage',
  components: { ExperimentListTab, ExperimentViewer },
  inject: ['girderRest'],
  props: {
    sortBy: {
      type: String,
      default: 'Date',
    },
    sortDesc: {
      type: String,
      default: 'true',
    },
    activeTab: {
      type: String,
      default: '_experimentList',
    },
    tabs: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      loaded: false,
      experimentCache: cache,
    };
  },
  computed: {
    currentTab() {
      return this.tabs.indexOf(this.activeTab) + 1;
    },
    sortDescBoolean() {
      return boolean(this.sortDesc);
    },
    tabObjects() {
      return this.tabs.map(
        (id) => this.experimentCache[id],
      ).filter((tab) => tab !== undefined);
    },
  },
  async created() {
    await Promise.all(this.tabs.map((tab) => this.fetchExperiment(tab)));
    this.loaded = true;
  },
  activated() {
    if (this.$refs.experimentListTab) {
      this.$refs.experimentListTab.refresh();
    }
  },
  methods: {
    viewExperiment(experiment) {
      const id = experiment._id;
      this.experimentCache[id] = experiment;
      if (!this.tabs.filter((t) => t === id)[0]) {
        this.updateTabList([...this.tabs, id]);
      }
      this.setTab(id);
    },
    async fetchExperiment(id) {
      if (!this.experimentCache[id]) {
        this.$set(this.experimentCache, id, await this.girderRest.getExperiment(id));
      }
      return this.experimentCache[id];
    },
    setTab(experimentId) {
      const query = {
        ...this.$route.query,
        activeTab: experimentId,
      };
      this.$router.push({ path: 'experiments', query });
    },
    setTabByIndex(index) {
      let tab;
      if (index === 0) {
        tab = '_experimentList';
      } else {
        tab = this.tabs[index - 1];
      }
      this.setTab(tab);
    },
    closeTab(id) {
      this.updateTabList(this.tabs.filter((tab) => tab !== id));
    },
    updateTabList(tabs) {
      const query = {
        ...this.$route.query,
        tabs,
      };
      this.$router.replace({ path: 'experiments', query });
    },
    updatePagingRoute({ sortBy, sortDesc }) {
      const query = {
        ...this.$route.query,
        sortBy,
        sortDesc: sortDesc ? 'true' : 'false',
      };
      this.$router.replace({ path: 'experiments', query });
    },
    updateCache(experiment) {
      this.$set(this.experimentCache, experiment._id, experiment);
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
