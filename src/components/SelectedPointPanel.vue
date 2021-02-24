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
  iron: (value) => value.toFixed(2),
  health: (value) => value.toFixed(2),
};

const excludedKeys = new Set(['id']);

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
      const mapper = this.info.type === 'spore' ? this.mapFungusValue.bind(this) : (key, value) => value;
      return keys.map((key) => [mapper(key, this.info[key]), key]);
    },
  },
  methods: {
    mapFungusValue(key, value) {
      return this.replaceValue(value, fungusValueMap[key] || {});
    },
    replaceValue(value, mapper) {
      if (mapper instanceof Function) {
        return mapper(value);
      }
      if (Object.prototype.hasOwnProperty.call(mapper, value)) {
        return mapper[value];
      }
      return value;
    },
  },
};
</script>
