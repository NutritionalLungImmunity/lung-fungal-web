<template>
  <div
    v-if="type === 'slider'"
  >
    <v-row class="px-5 py-2">
      <v-col
        cols="12"
        class="py-0"
      >
        <v-subheader
          class="panel-subheader pl-0"
        >
          {{ labelWithUnits }}
        </v-subheader>
        <experimental-option
          v-for="(value, index) in values"
          :key="index"
          :default-value="defaultValue"
          :value="value"
          :min="min"
          :max="max"
          :step="step"
          :color="color"
          :units="units"
          @input="onChange(index, $event)"
        />
        <div align="right">
          <v-btn
            small
            icon
            @click="onParamAdd()"
          >
            <v-icon
              class="v-input__icon"
            >
              mdi-plus-circle-outline
            </v-icon>
          </v-btn>
          <v-btn
            small
            icon
            :disabled="values.length == 1"
            @click="onParamDel()"
          >
            <v-icon
              class="v-input__icon"
            >
              mdi-minus-circle-outline
            </v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </div>
  <div
    v-else-if="type === 'checkbox'"
  >
    <v-row class="px-5 py-3">
      <v-col
        cols="12"
        class="py-0"
      >
        Unsupported at this time!
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ExperimentalOption from './ExperimentalOption.vue';

export default {
  components: { ExperimentalOption },
  props: {
    type: {
      type: String,
      default: 'slider',
      validator(value) {
        return ['slider', 'checkbox'].indexOf(value) !== -1;
      },
    },
    defaultValue: {
      type: Number,
      required: true,
    },
    values: {
      type: Array,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    tooltip: {
      type: String,
      required: true,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 1,
    },
    step: {
      type: Number,
      default: 1,
    },
    color: {
      type: String,
      required: true,
    },
    units: {
      type: String,
      required: false,
      default: null,
    },
  },
  computed: {
    labelWithUnits() {
      if (this.units) {
        return `${this.label} (${this.units})`;
      }
      return this.label;
    },
  },
  methods: {
    onChange(index, value) {
      const values = Array.from(
        [...this.values,]
      );
      values[index] = value;
      this.$emit('input', values);
    },
    onParamAdd() {
      const values = Array.from([
        ...this.values, this.defaultValue
      ]);
      this.$emit('input', values);
    },
    onParamDel() {
      const values = Array.from([
        ...this.values
      ]);
      values.pop();
      this.$emit('input', values);
    }
  },
};
</script>

<style scoped>
.panel-subheader {
  height: 32px;
}
</style>

<style>
.v-input__append-outer {
  margin: -3px 0 0;
}
</style>
