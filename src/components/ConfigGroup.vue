<template>
  <v-expansion-panel class="params-panel">
    <v-expansion-panel-header>
      {{ name }}
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <div class="pt-4">
        <config-option
          v-for="option in options"
          :key="option.id"
          :value="value[module][option.id] || option.default"
          :type="option.type || 'slider'"
          :label="option.label"
          :tooltip="option.help || option.label"
          :min="option.min"
          :max="option.max"
          :step="option.step"
          :color="color"
          :units="option.units || null"
          @input="onChange(option.id, $event)"
        />
      </div>
    </v-expansion-panel-content>
    <v-divider />
  </v-expansion-panel>
</template>

<script>
import ConfigOption from '@/components/ConfigOption.vue';

export default {
  components: {
    ConfigOption,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    module: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
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
  methods: {
    onChange(id, value) {
      const modules = {
        ...this.value,
      };
      modules[this.module] = {
        ...this.value[this.module],
        [id]: value,
      };
      this.$emit('input', modules);
    },
  },
};
</script>
