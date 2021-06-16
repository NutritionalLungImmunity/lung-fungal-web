<template>
  <v-card class="ma-2">
    <v-card-title>
      {{ name }} axis configuration
    </v-card-title>
    <v-card-text>
      <v-row
        class="px-2 pb-2 ma-0"
        justify="space-around"
      >
        <v-col cols="4">
          <v-row
            class="px-2 pb-2 ma-2"
            justify="space-around"
          >
            <h2>Data Source</h2>
          </v-row>
          <v-row
            class="px-2 pb-2 ma-0"
            justify="space-around"
          >
            <v-select
              v-model="selectedModule"
              :items="modules"
              label="Module"
              dense
              style="width: 100px"
            />
          </v-row>
          <v-row
            class="px-2 pb-2 ma-0"
            justify="space-around"
          >
            <v-select
              v-model="selectedVariable"
              :items="variables[selectedModule]"
              :disabled="!selectedModule || selectedModule === 'time'"
              label="Variable"
              dense
              style="width: 100px"
            />
          </v-row>
        </v-col>
        <v-col>
          <v-row
            class="px-2 pb-2 ma-0"
            justify="space-around"
          >
            <v-btn-toggle
              v-model="scale"
              align="center"
              mandatory
            >
              <v-btn>
                Linear
              </v-btn>
              <v-btn>
                Logarithmic
              </v-btn>
            </v-btn-toggle>
          </v-row>
          <v-row
            class="px-2 pb-2 ma-0"
            justify="space-around"
          >
            <v-switch
              v-model="autoBounds"
              :label="`Automatic bounds`"
            />
          </v-row>
          <v-row
            class="px-2 pb-2 ma-2"
          >
            <v-range-slider
              v-model="range"
              :disabled="autoBounds"
              :max="hardBounds[1]"
              :min="hardBounds[0]"
            >
              <template v-slot:prepend>
                <v-text-field
                  :value="range[0]"
                  class="mt-0 pt-0"
                  hide-details
                  single-line
                  type="number"
                  style="width: 60px"
                  @change="$set(range, 0, $event)"
                />
              </template>
              <template v-slot:append>
                <v-text-field
                  :value="range[1]"
                  class="mt-0 pt-0"
                  hide-details
                  single-line
                  type="number"
                  style="width: 60px"
                  @change="$set(range, 1, $event)"
                />
              </template>
            </v-range-slider>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    variables: {
      type: Object,
      required: true,
    },
    defaultToTime: {
      type: Boolean,
      required: false,
      default: false,
    },
    dataBounds: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedModule: this.defaultToTime ? 'time' : undefined,
      selectedVariable: undefined,
      scale: 0, // linear
      autoBounds: true,
      range: [0, 100],
    };
  },
  computed: {
    modules() {
      if (!this.variables) return [];
      return Object.keys(this.variables);
    },
    hardBounds() {
      if (!this.dataBounds) return [0, 100];
      const width = this.dataBounds[1] - this.dataBounds[0];
      const ub = this.dataBounds[1] + 0.1 * width;
      const lb = this.dataBounds[0] - 0.1 * width;
      return [lb, ub];
    },
  },
  watch: {
    dataBounds(newDataBounds) {
      this.range = Array.from(newDataBounds);
    },
    autoBounds(newAutoBounds) {
      if (newAutoBounds) {
        this.range = Array.from(this.hardBounds);
      }
    },
    selectedModule(moduleName) {
      if (moduleName === 'time'
        || !this.variables[moduleName].includes(this.selectedVariable)) {
        this.selectedVariable = undefined;
      }
      this.$emit('module-update', moduleName);
    },
    selectedVariable(variableName) {
      this.$emit('variable-update', variableName);
    },
    scale(newScale) {
      this.$emit('scale-update', newScale);
    },
    range(newRange) {
      this.$emit('range-update', newRange);
    },
  },
};
</script>
