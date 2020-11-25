<template>
  <v-main class="px-0">
    <v-row no-gutters>
      <v-col cols="5">
        <v-row no-gutters>
          <v-col
            v-for="panel in panels"
            :key="panel.title"
            cols="6"
            class="params-cols"
          >
            <config-panel
              v-model="values"
              :title="panel.title"
              :modules="panel.modules"
            />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="7">
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
          <config-dialog
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
import State from '@/data/state';
import config from '@/config';

const geometryFileUrl = 'https://data.kitware.com/api/v1/file/5fbbc06950a41e3d1968d2ad/download';

export default {
  name: 'ConfigPage',
  components: {
    ConfigDialog,
    ConfigPanel,
    Geometry,
  },
  inject: ['girderRest'],
  data() {
    // extract default values from the static configuration
    const values = {};
    Object.entries(config).forEach(([, panelOpts]) => {
      Object.entries(panelOpts.modules).forEach(([module, moduleOpts]) => {
        values[module] = values[module] || {};
        Object.entries(moduleOpts).forEach(([, option]) => {
          values[module][option.id] = option.default;
        });
      });
    });
    return {
      panels: config,
      values,
    };
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
  methods: {
    onCreate() {
      this.$router.push('simulations');
    },
  },
};
</script>
