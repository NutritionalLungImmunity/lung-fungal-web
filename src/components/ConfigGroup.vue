<template>
  <v-expansion-panel
    class="params-panel"
  >
    <v-expansion-panel-header>
      {{ name }}
    </v-expansion-panel-header>
    <v-expansion-panel-content>
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
    </v-expansion-panel-content>
    <v-divider />
  </v-expansion-panel>
</template>

<script>
import ConfigOption from '@/components/ConfigOption.vue';
import ExperimentalOptionList from '@/components/ExperimentalOptionList.vue';

export default {
  components: {
    ConfigOption,
    ExperimentalOptionList,
  },
  props: {
    name: {
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
