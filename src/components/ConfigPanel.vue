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
          :color="color"
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
    color: {
      type: String,
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
.params-cols:first-of-type .scrollable {
  border-left: 3px solid #9575CD;
}
.params-cols:nth-of-type(2) .param-card .v-card__title:before {
  background: #42A5F5;
}
.params-cols:nth-of-type(2) .scrollable {
  border-left: 3px solid #42A5F5;
}
.params-cols:nth-of-type(3) .param-card .v-card__title:before {
  background: #4DD0E1;
}
.params-cols:nth-of-type(3) .scrollable {
  border-left: 3px solid #4DD0E1;
}
.params-cols:last-of-type .param-card .v-card__title:before {
  background: #D4E157;
}
.params-cols:last-of-type .scrollable {
  border-left: 3px solid #D4E157;
}
</style>

<style>
.params-panel .v-expansion-panel-content__wrap {
  background: rgba(0, 0, 0, 0.25);
  padding-left: 0;
  padding-right: 0;
}
</style>
