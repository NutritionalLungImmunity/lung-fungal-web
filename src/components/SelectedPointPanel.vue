<template>
  <v-simple-table
    :dense="true"
  >
    <template v-slot:default>
      <tbody>
        <tr
          v-for="row in rows"
          :key="row[1]"
        >
          <td>{{ row[1] }}</td>
          <td>{{ row[0] }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
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
    99: 'drifting',
    0: 'resting',
    1: 'swollen',
    2: 'germinated',
    3: 'growable',
    4: 'grown',
    5: 'dead',
  },
  form: {
    0: 'condia',
    1: 'hyphae',
  },
  mobile: (value) => !!value,
  internalized: (value) => !!value,
  dead: (value) => !!value,
  iron: toFixedIfNumeric,
  health: toFixedIfNumeric,
};
const macrophageValueMap = {
  dead: (value) => !!value,
  phagosome(value) {
    return value.filter((v) => (v !== null) && (v >= 0));
  },
};
const neutrophilValueMap = {
  dead: (value) => !!value,
};
const valueMappers = {
  'A. fumigatus': fungusValueMap,
  macrophage: macrophageValueMap,
  neutrophil: neutrophilValueMap,
};

const excludedKeys = new Set(['id', 'scale']);

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
