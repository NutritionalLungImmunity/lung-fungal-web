<template>
  <v-navigation-drawer
    v-model="value.enabled"
    app
    dark
    right
    temporary
  >
    <v-toolbar
      fixed
      flat
    >
      <v-toolbar-title>
        Filters
      </v-toolbar-title>
    </v-toolbar>
    <v-divider />
    <filter-dialog />
    <div class="drawer-wrapper d-flex flex-column">
      <v-list dense>
        <v-list-item>
          <v-list-item-content>
            Filtering option #1
          </v-list-item-content>
          <v-list-item-action>
            <v-checkbox />
          </v-list-item-action>
        </v-list-item>
        <v-divider />
        <v-list-item>
          <v-list-item-content>
            Filtering option #2
          </v-list-item-content>
          <v-list-item-action>
            <v-checkbox />
          </v-list-item-action>
        </v-list-item>
        <v-divider />
        <v-list-item>
          <v-list-item-content>
            Filtering option #3
          </v-list-item-content>
          <v-list-item-action>
            <v-checkbox />
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-spacer />
      <v-footer class="pa-0">
        <v-btn
          block
          color="primary"
          depressed
          tile
          x-large
        >
          Apply Filters
        </v-btn>
      </v-footer>
    </div>
  </v-navigation-drawer>
</template>

<script>
import FilterDialog from '@/components/FilterDialog.vue';

export default {
  components: {
    FilterDialog,
  },
  props: {
    value: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
};
</script>
