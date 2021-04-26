<template>
  <v-expansion-panel
    class="params-cols"
    color="grey darken-3"
  >
    <v-expansion-panel-header color="grey darken-3">
      {{ title }}
    </v-expansion-panel-header>
    <v-expansion-panel-content color="grey darken-3">
      <v-card
        class="param-cols border-right"
        color="grey darken-3"
        dark
        flat
        tile
      >
        <v-card-text class="pa-0">
          <div
            v-for="option in options"
            :key="option.module+'.'+option.id"
            class="pt-4"
          >
            <experimental-option-list
              v-if="option.experimental"
              :default-value="option.default"
              :values="value[option.module][option.id]"
              :type="option.type || 'slider'"
              :label="option.label"
              :tooltip="option.help || option.label"
              :min="option.min"
              :max="option.max"
              :step="option.step"
              :color="color"
              :units="option.units || null"
              :option-id="option.id"
              :option-module="option.module"
              @input="onChange(option.id, option.module, $event)"
            />
            <config-option
              v-else
              :value="value[option.module][option.id] || option.default"
              :type="option.type || 'slider'"
              :label="option.label"
              :tooltip="option.help || option.label"
              :min="option.min"
              :max="option.max"
              :step="option.step"
              :color="color"
              :units="option.units || null"
              @input="onChange(option.id, option.module, $event)"
            />
          </div>
          <v-expansion-panels
            v-model="panel"
            accordion
            flat
            multiple
            tile
          >
            <config-group
              v-for="(opts, subsection) in subsections"
              :key="subsection"
              :name="subsection.charAt(0).toUpperCase() + subsection.slice(1)"
              :options="opts"
              :value="value"
              :color="color"
              @input="$emit('input', $event)"
            />
          </v-expansion-panels>
        </v-card-text>
      </v-card>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import ConfigGroup from '@/components/ConfigGroup.vue';
import ConfigOption from '@/components/ConfigOption.vue';
import ExperimentalOptionList from '@/components/ExperimentalOptionList.vue';

export default {
  components: {
    ConfigGroup,
    ConfigOption,
    ExperimentalOptionList,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    value: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    subsections: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      panel: [],
    };
  },
  methods: {
    onChange(id, module, value) {
      const modules = {
        ...this.value,
      };
      modules[module] = {
        ...this.value[module],
        [id]: value,
      };
      this.$emit('input', modules);
    },
  },
};
</script>

<style scoped>
.half-height {
  /* set height to 50% of viewport height minus the height of the v-app-bar divided by 2 */
  height: calc(50vh - 32px);
}
.full-height {
  /* set height to 100% of viewport height minus the height of the v-app-bar */
  height: calc(100vh - 64px);
}
.border-right .v-card__title,
.border-right .v-card__text {
  border-right: 1px solid rgba(255, 255, 255, 0.12);
}
.param-card .v-card__title {
  background: #353535;
}
.param-card .v-card__title:before {
  background: inherit;
  border: 1px solid #2b2b2b;
  border-radius: 100%;
  content: '';
  display: inline;
  height: 8px;
  margin-right: 15px;
  width: 8px;
}
.params-panel {
  background: transparent !important;
}
.params-panel .v-list {
  background: transparent;
}
.scrollable {
  box-shadow: inset 0 -25px 25px -25px rgba(0, 0, 0, .35);
  /* set height to 100% minus the height of the v-card-title and divider combined */
  height: calc(100% - 66px);
  overflow: hidden;
  overflow-y: auto;
}
.params-cols:first-of-type .param-card .v-card__title:before {
  background: #9575CD;
}
.params-cols:first-of-type {
  border-left: 3px solid #9575CD;
}
.params-cols:nth-of-type(2) .param-card .v-card__title:before {
  background: #42A5F5;
}
.params-cols:nth-of-type(2) {
  border-left: 3px solid #42A5F5;
}
.params-cols:nth-of-type(3) .param-card .v-card__title:before {
  background: #4DD0E1;
}
.params-cols:nth-of-type(3) {
  border-left: 3px solid #4DD0E1;
}
.params-cols:nth-of-type(4) {
  border-left: 3px solid #43a047;
}
.params-cols:nth-of-type(5) {
  border-left: 3px solid #d4e157;
}
.params-cols:last-of-type .param-card .v-card__title:before {
  background: #e53935;
}
.params-cols:last-of-type {
  border-left: 3px solid #e53935;
}
</style>

<style>
.params-panel .v-expansion-panel-content__wrap {
  background: rgba(0, 0, 0, 0.25);
  padding-left: 0;
  padding-right: 0;
}
</style>
