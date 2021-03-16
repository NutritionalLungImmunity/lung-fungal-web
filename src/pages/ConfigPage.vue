<template>
  <v-main
    class="px-0"
    dark
  >
    <v-row no-gutters>
      <v-col cols="3">
        <v-row
          class="scrollable"
          no-gutters
        >
          <v-expansion-panels
            accordion
            dark
            flat
            multiple
            tile
            vmodel="panel"
          >
            <config-panel
              v-for="(panel, id) in panels"
              :key="panel.title"
              v-model="values"
              :title="panel.title"
              :modules="panel.modules"
              :color="colors[id]"
            />
          </v-expansion-panels>
        </v-row>
      </v-col>
      <v-col cols="9">
        <geometry
          v-if="geometry"
          class="viz"
          :geometry="geometry"
        />
        <v-footer
          class="py-3"
          color="grey darken-4"
        >
          <v-spacer />
          <login-dialog
            v-if="girderRest.user === null"
            :icon="false"
          >
            Login to run
          </login-dialog>
          <config-dialog
            v-else
            :config="values"
            @create="onCreate"
          />
        </v-footer>
      </v-col>
    </v-row>
  </v-main>
</template>

<script>
import ConfigDialog from '@/components/ConfigDialog.vue';
import ConfigPanel from '@/components/ConfigPanel.vue';
import Geometry from '@/components/Geometry.vue';
import LoginDialog from '@/components/LoginDialog.vue';
import State from '@/data/state';
import config from '@/config';
import cache from '@/cache';

const geometryFileUrl = 'https://data.kitware.com/api/v1/file/5fbbc06950a41e3d1968d2ad/download';

export default {
  name: 'ConfigPage',
  components: {
    ConfigDialog,
    ConfigPanel,
    Geometry,
    LoginDialog,
  },
  inject: ['girderRest'],
  props: {
    initialValues: {
      type: String,
      default: '{}',
    },
  },
  data() {
    return {
      panels: config,
      values: {},
      // These colors should match the colors embedded in the CSS for ConfigPanel.
      colors: {
        properties: 'deep-purple lighten-2',
        macrophage: 'blue lighten-1',
        neutrophil: 'cyan lighten-2',
        epithelium: 'lime lighten-1',
        fungus: 'red darken-1',
        molecules: 'green darken-1',
      },
    };
  },
  watch: {
    initialValues() {
      this.setDefaults();
    },
  },
  asyncComputed: {
    geometry: {
      async get() {
        const { data } = await this.girderRest.get(geometryFileUrl, { responseType: 'arraybuffer' });
        return State.loadImageData(data);
      },
      default: null,
    },
  },
  created() {
    this.setDefaults();
  },
  methods: {
    async onCreate(simulationId) {
      const { query } = this.$route;
      let tabs = query.tabs || [];
      let activeTab = '_simulationList';

      if (!Array.isArray(tabs)) {
        tabs = [tabs];
      }

      // TODO: this is to mitigate a bug when the simulation id is not returned, remove when fixed
      if (simulationId) {
        // TODO: this logic should be moved to vuex
        this.$set(cache, simulationId, await this.girderRest.getSimulation(simulationId));
        tabs.push(simulationId);
        activeTab = simulationId;
      }

      this.$router.push({
        path: 'simulations',
        query: {
          ...query,
          tabs,
          activeTab,
        },
      });
    },
    setDefaults() {
      const initialValues = JSON.parse(this.initialValues);
      // extract default values from the static configuration
      const values = {};
      Object.entries(config).forEach(([, panelOpts]) => {
        Object.entries(panelOpts.modules).forEach(([module, moduleOpts]) => {
          const initialValueModule = initialValues[module] || {};
          values[module] = values[module] || {};
          Object.entries(moduleOpts).forEach(([, option]) => {
            const initialValue = initialValueModule[option.id];
            values[module][option.id] = initialValue === undefined ? option.default : initialValue;
          });
        });
      });
      this.values = values;
    },
  },
};
</script>

<style scoped>
.scrollable {
  box-shadow: inset 0 -25px 25px -25px rgba(0, 0, 0, .35);
  /* set height to 100% minus the height of the v-card-title and divider combined */
  height: calc(100vh - 66px);
  overflow: hidden;
  overflow-y: auto;
}
</style>
