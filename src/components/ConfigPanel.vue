<template>
  <v-card
    class="param-card half-height border-right"
    color="grey darken-3"
    dark
    flat
    tile
  >
    <v-card-title>
      {{ title }}
    </v-card-title>

    <v-divider />

    <v-card-text class="pa-0 scrollable">
      <v-expansion-panels
        v-model="panel"
        accordion
        flat
        multiple
        tile
      >
        <config-group
          v-for="(opts, module) in modules"
          :key="module"
          :name="module.charAt(0).toUpperCase() + module.slice(1)"
          :options="opts"
          :module="module"
          :value="value"
          @input="$emit('input', $event)"
        />
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script>
import ConfigGroup from '@/components/ConfigGroup.vue';

export default {
  components: {
    ConfigGroup,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    modules: {
      type: Object,
      required: true,
    },
    value: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      panel: [],
    };
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
</style>

<style>
.params-panel .v-expansion-panel-content__wrap {
  background: rgba(0, 0, 0, .25);
  padding-left: 0;
  padding-right: 0;
}
</style>
