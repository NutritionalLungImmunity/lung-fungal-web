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
        TODO: Explicit vertical range setting
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-btn-toggle
          v-model="barGraphType"
          mandatory
        >
          <v-btn>
            <svg
              style="width:24px;height:24px"
              viewBox="0 0 24 24"
            >
              <path
                style="fill:#000000;fill-rule:evenodd;stroke-width:1"
                d="m 12,1 v 2 h 3 V 5 H 5 v 18 h 10 v 6 h -3 v 2 h 8
                V 29 H 17 V 23 H 27 V 5 H 17 V 3 h 3 V 1 Z
                M 7,7 h 18 v 5 H 7 Z
                m 0,7 h 18 v 7 H 7 Z"
                transform="scale(0.75)"
              />
            </svg>
          </v-btn>
          <v-btn>
            <svg
              style="width:24px;height:24px"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M3,22V8H7V22H3M10,22V2H14V22H10M17,22V14H21V22H17Z"
              />
            </svg>
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        TODO: Show Outliers vs Show all
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
      barGraphType: 0,
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
    barGraphType(newType) {
      this.$emit('bar-graph-type-update', newType === 0 ? 'box' : 'bar');
    },
  },
};
</script>

<style scoped>
.container {
    background: #FFFFFF;
}
</style>
