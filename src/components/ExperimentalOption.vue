<template>
  <v-slider
    :color="color"
    hide-details
    thumb-size="24"
    :thumb-label="true"
    :value="value"
    :min="min"
    :max="max"
    :step="step"
    @input="$emit('input', $event)"
  >
    <v-tooltip
      slot="prepend"
      bottom
    >
      <template
        v-slot:activator="{on, attrs}"
      >
        <v-btn
          slot="activator"
          icon
          text
          :max-height="24"
          :max-width="24"
          v-bind="attrs"
          v-on="on"
          @click="reset"
        >
          <v-icon
            class="v-input__icon"
          >
            mdi-undo
          </v-icon>
        </v-btn>
      </template>
      <span>Reset to default</span>
    </v-tooltip>
    <template v-slot:append>
      <v-text-field
        :value="value"
        class="mt-0 pt-0"
        type="number"
        style="width: 72px"
        :min="min"
        :max="max"
        :step="step"
        dense
        hide-details
        outlined
        @input="$emit('input', $event)"
      />
    </template>
  </v-slider>
</template>

<script>
export default {
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
    value: {
      type: Number,
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
    reset() {
      this.$emit('input', this.defaultValue);
    },
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
