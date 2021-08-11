<template>
  <v-card>
    <v-card-title>
      {{ info['type'] }}
    </v-card-title>
    <v-simple-table
      :dense="true"
    >
      <template v-slot:default>
        <tbody>
          <tr
            v-for="row in rows"
            :key="row[1]"
          >
            <td>{{ row[1].replace("_", " ") }}</td>
            <td>{{ row[0] }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </v-card>
</template>

<script>
function toFixedIfNumeric(value) {
  if (Number.isFinite(value)) {
    return value.toFixed(2);
  }
  return value;
}
const fungusValueMap = {
  status: {
    // 99: 'drifting',
    0: 'resting',
    1: 'swollen',
    2: 'germ tube',
    3: 'hyphae',
    4: 'dying',
    5: 'dead',
    6: 'sterile conidia',
  },
  state: {
    0: 'free',
    1: 'internalizing',
    2: 'releasing',
  },
  // form: {
  //   0: 'condia',
  //   1: 'hyphae',
  // },
  mobile: (value) => !!value,
  internalized: (value) => !!value,
  dead: (value) => !!value,
  iron_pool: toFixedIfNumeric,
};

const phagocyteStatusMap = {
  0: 'Inactive',
  1: 'Inactivating',
  2: 'Resting',
  3: 'Activating',
  4: 'Active',
  5: 'Apoptotic',
  6: 'Necrotic',
  7: 'Dead',
  8: 'Anergic',
  9: 'Interacting',
};
const phagocyteStateMap = {
  0: 'Free',
  1: 'Interacting',
};

const macrophageValueMap = {
  status: phagocyteStatusMap,
  state: phagocyteStateMap,
  dead: (value) => !!value,
  phagosome(value) {
    return value.filter((v) => (v !== null) && (v >= 0)).length;
  },
  iron_pool: toFixedIfNumeric,
  tf: (value) => !!value,
  tnfa: (value) => !!value,
  fpn: (value) => !!value,
  engaged: (value) => !!value,
  has_conidia: (value) => !!value,
};
const neutrophilValueMap = {
  status: phagocyteStatusMap,
  state: phagocyteStateMap,
  phagosome(value) {
    return value.filter((v) => (v !== null) && (v >= 0)).length;
  },
  dead: (value) => !!value,
  has_conidia: (value) => !!value,
};
const pneumocyteValueMap = {
  status: phagocyteStatusMap,
  state: phagocyteStateMap,
  phagosome(value) {
    return value.filter((v) => (v !== null) && (v >= 0)).length;
  },
  dead: (value) => !!value,
  has_conidia: (value) => !!value,
};

const valueMappers = {
  'A. fumigatus': fungusValueMap,
  macrophage: macrophageValueMap,
  neutrophil: neutrophilValueMap,
  pneumocyte: pneumocyteValueMap,
};

const excludedKeys = new Set(['type', 'id', 'scale', 'color', 'next_branch',
  'next_septa', 'previous_septa', 'is_root', 'root', 'vec', 'tip',
  'max_move_step', 'move_step']);

export default {
  props: {
    info: {
      type: Object,
      required: true,
    },
  },
  computed: {
    rows() {
      const keys = Object.keys(this.info).filter((key) => !excludedKeys.has(key)).sort();
      const mapper = this.getValueMapper(this.info.type);
      return keys.map((key) => [mapper(key, this.info[key]), key]);
    },
  },
  methods: {
    mapFungusValue(key, value) {
      return this.replaceValue(value, fungusValueMap[key] || {});
    },
    getValueMapper(type) {
      const mapper = valueMappers[type];
      if (mapper) {
        return (key, value) => this.replaceValue(value, mapper[key] || {});
      }
      return (key, value) => value;
    },
    replaceValue(value, mapper) {
      let v = value;
      if (value.length === 1) {
        // this is not a normal array but a Float64Array
        v = value[0]; // eslint-disable-line prefer-destructuring
      }
      if (mapper instanceof Function) {
        return mapper(v);
      }
      if (Object.prototype.hasOwnProperty.call(mapper, v)) {
        return mapper[v];
      }
      return value;
    },
  },
};
</script>
