<template>
  <v-main class="px-0">
    <v-row no-gutters>
      <v-col cols="5">
        <v-row no-gutters>
          <v-col
            cols="6"
          >
            <v-card
              class="param-card half-height border-right"
              color="grey darken-3"
              dark
              flat
              tile
            >
              <v-card-title>
                Geometry
              </v-card-title>

              <v-divider />

              <v-card-text class="pa-0 scrollable">
                <v-expansion-panels
                  v-model="geometryPanel"
                  accordion
                  flat
                  multiple
                  tile
                >
                  <v-expansion-panel class="params-panel">
                    <v-expansion-panel-header>
                      Simulation
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-list dense>
                        <v-list-item>
                          stuff
                        </v-list-item>
                        <v-list-item>
                          stuff
                        </v-list-item>
                        <v-list-item>
                          stuff
                        </v-list-item>
                      </v-list>
                    </v-expansion-panel-content>
                    <v-divider />
                  </v-expansion-panel>

                  <v-expansion-panel class="params-panel">
                    <v-expansion-panel-header>
                      Macrophage
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-list dense>
                        <v-list-item>
                          stuff
                        </v-list-item>
                        <v-list-item>
                          stuff
                        </v-list-item>
                        <v-list-item>
                          stuff
                        </v-list-item>
                      </v-list>
                    </v-expansion-panel-content>
                    <v-divider />
                  </v-expansion-panel>

                  <v-expansion-panel class="params-panel">
                    <v-expansion-panel-header>
                      Fungus
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-list dense>
                        <v-list-item>
                          stuff
                        </v-list-item>
                        <v-list-item>
                          stuff
                        </v-list-item>
                        <v-list-item>
                          stuff
                        </v-list-item>
                      </v-list>
                    </v-expansion-panel-content>
                    <v-divider />
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card
              class="param-card half-height"
              color="grey darken-3"
              dark
              flat
              tile
            >
              <v-card-title>
                Dynamics
              </v-card-title>

              <v-divider />

              <v-card-text class="pa-0 scrollable">
                <v-expansion-panels
                  v-model="dynamicsPanel"
                  accordion
                  flat
                  multiple
                  tile
                >
                  <v-expansion-panel class="params-panel">
                    <v-expansion-panel-header>
                      Simulation
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-list dense>
                        <v-list-item>
                          stuff
                        </v-list-item>
                        <v-list-item>
                          stuff
                        </v-list-item>
                        <v-list-item>
                          stuff
                        </v-list-item>
                      </v-list>
                    </v-expansion-panel-content>
                    <v-divider />
                  </v-expansion-panel>

                  <v-expansion-panel class="params-panel">
                    <v-expansion-panel-header>
                      Macrophage
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-list dense>
                        <v-list-item>
                          stuff
                        </v-list-item>
                        <v-list-item>
                          stuff
                        </v-list-item>
                        <v-list-item>
                          stuff
                        </v-list-item>
                      </v-list>
                    </v-expansion-panel-content>
                    <v-divider />
                  </v-expansion-panel>

                  <v-expansion-panel class="params-panel">
                    <v-expansion-panel-header>
                      Fungus
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-list dense>
                        <v-list-item>
                          stuff
                        </v-list-item>
                        <v-list-item>
                          stuff
                        </v-list-item>
                        <v-list-item>
                          stuff
                        </v-list-item>
                      </v-list>
                    </v-expansion-panel-content>
                    <v-divider />
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card
              class="param-card half-height border-right"
              color="grey darken-3"
              dark
              flat
              tile
            >
              <v-divider />

              <v-card-title>
                Cell Populations
              </v-card-title>

              <v-divider />

              <v-card-text class="pa-0 scrollable">
                <v-expansion-panels
                  v-model="cellPopsPanel"
                  accordion
                  flat
                  multiple
                  tile
                >
                  <v-expansion-panel class="params-panel">
                    <v-expansion-panel-header>
                      Simulation
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-list dense>
                        <v-list-item>
                          stuff
                        </v-list-item>
                        <v-list-item>
                          stuff
                        </v-list-item>
                        <v-list-item>
                          stuff
                        </v-list-item>
                      </v-list>
                    </v-expansion-panel-content>
                    <v-divider />
                  </v-expansion-panel>

                  <v-expansion-panel class="params-panel">
                    <v-expansion-panel-header>
                      Macrophage
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-list dense>
                        <v-list-item>
                          stuff
                        </v-list-item>
                        <v-list-item>
                          stuff
                        </v-list-item>
                        <v-list-item>
                          stuff
                        </v-list-item>
                      </v-list>
                    </v-expansion-panel-content>
                    <v-divider />
                  </v-expansion-panel>

                  <v-expansion-panel class="params-panel">
                    <v-expansion-panel-header>
                      Fungus
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-list dense>
                        <v-list-item>
                          stuff
                        </v-list-item>
                        <v-list-item>
                          stuff
                        </v-list-item>
                        <v-list-item>
                          stuff
                        </v-list-item>
                      </v-list>
                    </v-expansion-panel-content>
                    <v-divider />
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-card
              class="param-card half-height"
              color="grey darken-3"
              dark
              flat
              tile
            >
              <v-divider />

              <v-card-title>
                Simulation Properties
              </v-card-title>

              <v-divider />

              <v-card-text class="pa-0 scrollable">
                <v-expansion-panels
                  v-model="simPropsPanel"
                  accordion
                  flat
                  multiple
                  tile
                >
                  <v-expansion-panel class="params-panel">
                    <v-expansion-panel-header>
                      Simulation
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-list dense>
                        <v-list-item>
                          stuff
                        </v-list-item>
                        <v-list-item>
                          stuff
                        </v-list-item>
                        <v-list-item>
                          stuff
                        </v-list-item>
                      </v-list>
                    </v-expansion-panel-content>
                    <v-divider />
                  </v-expansion-panel>

                  <v-expansion-panel class="params-panel">
                    <v-expansion-panel-header>
                      Macrophage
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-list dense>
                        <v-list-item>
                          stuff
                        </v-list-item>
                        <v-list-item>
                          stuff
                        </v-list-item>
                        <v-list-item>
                          stuff
                        </v-list-item>
                      </v-list>
                    </v-expansion-panel-content>
                    <v-divider />
                  </v-expansion-panel>

                  <v-expansion-panel class="params-panel">
                    <v-expansion-panel-header>
                      Fungus
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-list dense>
                        <v-list-item>
                          stuff
                        </v-list-item>
                        <v-list-item>
                          stuff
                        </v-list-item>
                        <v-list-item>
                          stuff
                        </v-list-item>
                      </v-list>
                    </v-expansion-panel-content>
                    <v-divider />
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="7">
        Stuff
      </v-col>
    </v-row>
  </v-main>
</template>

<script>
export default {
  name: 'ConfigPage',
  components: {},
  inject: ['girderApi', 'girderRest'],
  data() {
    return {
      geometryPanel: [],
      dynamicsPanel: [],
      cellPopsPanel: [],
      simPopsPanel: [],
    };
  },
  asyncComputed: {},
  methods: {},
};
</script>

<style scoped>
.half-height {
  /* set height to 50% of viewport height minus the height of the v-app-bar divided by 2 */
  height: calc(50vh - 32px);
}
.full-height {
  /* set height to 100% of viewport height minus the height of the v-app-bar */
  height: calc(100vh - 64px);
}
.border-right .v-card__title,
.border-right .v-card__text {
  border-right: 1px solid rgba(255, 255, 255, 0.12);
}
.param-card .v-card__title {
  background: #353535;
}
.params-panel {
  background: transparent !important;
}
.params-panel .v-list {
  background: transparent;
}
.scrollable {
  box-shadow: inset 0 -25px 25px -25px rgba(0, 0, 0, .35);
  /* set height to 100% minus the height of the v-card-title and divider combined */
  height: calc(100% - 65px);
  overflow: hidden;
  overflow-y: auto;
}
</style>

<style>
.params-panel .v-expansion-panel-content__wrap {
  padding-left: 0;
  padding-right: 0;
}
</style>
