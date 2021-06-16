<template>
  <v-container
    class="container"
    fluid
  >
    <v-row>
      <v-col>
        <v-select
          v-model="selectedVariables"
          :items="itemList"
          :menu-props="{ maxHeight: '400' }"
          label="Select variables to plot"
          multiple
          chips
          deletable-chips
          hint="Variables"
          persistent-hint
          append-outer-icon="mdi-database"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-slider
          v-model="timePoint"
          :max="timeBounds[1]"
          :min="timeBounds[0]"
          :label="`Time`"
          thumb-label
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        TODO: Explicit range setting
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        TODO: Bars vs Box and Whiskers
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        TODO: Show Outliers vs Not vs Show all
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        TODO: Group by experiment vs group by variable
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  props: {
    variables: {
      type: Object,
      default: undefined,
    },
    timeBounds: {
      type: Array,
      default: undefined,
    },
  },
  data() {
    return {
      selectedVariables: [],
      timePoint: 0,
    };
  },
  computed: {
    itemList() {
      if (!this.variables) {
        return [];
      }
      const items = [];
      Object.entries(this.variables).forEach(([moduleName, vars]) => {
        if (moduleName === 'time') return; // doesn't make sense to plot time here

        vars.forEach((varName) => items.push({
          text: `${moduleName} ${varName}`,
          value: { module: moduleName, variable: varName },
          disabled: false, // TODO: if there is a selection, disable anything
          // with mis-matched units
        }));
      });
      return items;
    },
  },
  watch: {
    selectedVariables(newSelectedVars) {
      this.$emit('bar-graph-variable-update', newSelectedVars);
    },
    timePoint(newTimePoint) {
      this.$emit('time-point-update', newTimePoint);
    },
  },
};
</script>

<style scoped>
.container {
    background: #FFFFFF;
}
</style>
