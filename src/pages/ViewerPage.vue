<template>
  <v-content>
    <v-navigation-drawer
      app
      class="view-controls"
      clipped
      dark
      permanent
    >
      <v-card
        color="transparent"
        flat
        tile
      >
        <v-card-subtitle
          class="align-center d-flex grey--text py-2"
        >
          Viewer Controls
          <v-spacer />
          <div class="expansion-controls">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-if="panel.length < 3"
                  icon
                  small
                  @click="all"
                  v-on="on"
                >
                  <v-icon size="16">
                    mdi-arrow-expand-vertical
                  </v-icon>
                </v-btn>
                <v-btn
                  v-else
                  icon
                  disabled
                  small
                >
                  <v-icon size="16">
                    mdi-arrow-expand-vertical
                  </v-icon>
                </v-btn>
              </template>
              <span>Expand All</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-if="panel.length > 0"
                  icon
                  small
                  @click="none"
                  v-on="on"
                >
                  <v-icon size="16">
                    mdi-arrow-collapse-vertical
                  </v-icon>
                </v-btn>
                <v-btn
                  v-else
                  icon
                  disabled
                  small
                >
                  <v-icon size="16">
                    mdi-arrow-collapse-vertical
                  </v-icon>
                </v-btn>
              </template>
              <span>Collapse All</span>
            </v-tooltip>
          </div>
        </v-card-subtitle>
        <v-divider />
        <v-expansion-panels
          v-model="panel"
          accordion
          flat
          multiple
          tile
        >
          <v-expansion-panel
            v-for="(item,i) in viewPanels"
            :key="i"
            class="grey darken-3"
          >
            <v-expansion-panel-header>
              {{ item.header }}
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              Controls here
              <div class="d-flex panel-footer pt-3">
                <v-spacer />
                <v-btn
                  color="primary"
                  small
                >
                  Apply
                </v-btn>
              </div>
            </v-expansion-panel-content>
            <v-divider />
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card>
    </v-navigation-drawer>
  </v-content>
</template>

<script>
export default {
  name: 'ViewerPage',
  data() {
    return {
      panel: [],
      viewPanels: [
        {
          header: 'Geometry',
          controls: '',
        },
        {
          header: 'Cell Population',
        },
        {
          header: 'Dynamic Properties',
        },
      ],
    };
  },
  methods: {
    // Create an array the length of our items
    // with all values as true
    all() {
      this.panel = [...Array(this.viewPanel.length).keys()];
    },
    // Reset the panel
    none() {
      this.panel = [];
    },
  },
};
</script>

<style scoped>
.toolbar-items{
  width: 90%;
}
</style>
