<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>
        FLungGui
      </v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <v-tabs
          background-color="transparent"
          height="64"
        >
          <v-tab to="config">
            Configuration
          </v-tab>
          <v-tab to="viewer">
            Viewer
          </v-tab>
          <v-tab to="simulations">
            Simulation List
          </v-tab>
          <v-tab to="compare">
            Compare
          </v-tab>
        </v-tabs>
      </v-toolbar-items>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
};
</script>
