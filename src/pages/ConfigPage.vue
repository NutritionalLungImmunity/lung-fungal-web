<template>
  <v-content>
    Simulation configuration page
    <v-navigation-drawer
      app
      class="view-controls"
      clipped
      dark
      permanent
    >
      <div class="drawer-wrapper d-flex flex-column">
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
                    v-if="panel.length < panelCount"
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
              class="grey darken-3"
            >
              <v-expansion-panel-header>
                Name
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-text-field
                  v-model="name"
                />
              </v-expansion-panel-content>
              <v-divider />
            </v-expansion-panel>

            <v-expansion-panel
              class="grey darken-3"
            >
              <v-expansion-panel-header>
                Time
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-slider
                  v-model="time"
                  min="1"
                  max="100"
                  step="1"
                >
                  <template v-slot:append>
                    <v-text-field
                      v-model="time"
                      class="mt-0 pt-0"
                      hide-details
                      single-line
                      type="number"
                      style="width: 45px"
                    />
                  </template>
                </v-slider>
              </v-expansion-panel-content>
              <v-divider />
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
        <v-spacer />
        <v-footer class="pa-0">
          <v-btn
            block
            color="primary"
            depressed
            x-large
            tile
            @click="runSimulation"
          >
            <v-icon
              dark
              left
            >
              mdi-lightning-bolt
            </v-icon>
            Run Simulation
          </v-btn>
        </v-footer>
      </div>
    </v-navigation-drawer>
  </v-content>
</template>

<script>
export default {
  name: 'ConfigPage',
  inject: ['girderRest'],
  data() {
    return {
      name: '',
      time: 20,
      panel: [],
      panelCount: 2,
    };
  },
  methods: {
    // Create an array the length of our items
    // with all values as true
    all() {
      this.panel = [...Array(this.panelCount).keys()];
    },
    // Reset the panel
    none() {
      this.panel = [];
    },
    runSimulation() {
      // needs validation
      if (this.name) {
        this.girderRest.runSimulation({
          name: this.name,
          targetTime: this.time,
        });
      }
    },
  },
};
</script>
