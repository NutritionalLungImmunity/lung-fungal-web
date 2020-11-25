<template>
  <div
    v-if="type === 'slider'"
  >
    <v-row class="px-5 py-3">
      <v-col cols="12">
        <v-subheader class="pl-0">
          {{ label }}
        </v-subheader>
        <v-slider
          color="primary"
          hide-details
          thumb-size="24"
          :thumb-label="true"
          :title="tooltip"
          :value="value"
          :min="min"
          :max="max"
          :step="step"
          @input="$emit('input', $event)"
        >
          <template v-slot:append>
            <v-text-field
              v-model="value"
              class="mt-0 pt-0"
              type="number"
              style="width: 60px"
            />
          </template>
        </v-slider>
      </v-col>
    </v-row>
  </div>
  <div
    v-else-if="type === 'checkbox'"
  >
    <v-row class="px-5 py-3">
      <v-col cols="12">
        <v-checkbox
          :label="label"
          :value="value"
          :title="tooltip"
          @input="$emit('input', $event)"
        />
      </v-col>
    </v-row>
  </div>
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
    value: {
      type: [String, Number, Boolean],
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
      default: 0,
    },
    step: {
      type: Number,
      default: 1,
    },
  },
};
</script>
