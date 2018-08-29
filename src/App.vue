<template>
  <v-app>
    <v-toolbar
      app
    >
      <v-toolbar-title>
        FLungGui
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat @click.stop="drawerOpen = !drawerOpen">
          Load data
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <LungVolume/>
    </v-content>
    <v-navigation-drawer
      temporary
      right
      v-model="drawerOpen"
      fixed
      app
    >
      <v-list>
        <v-list-tile @click="true">
          <v-list-tile-content>
            <v-list-tile-title>Upload a VTK PolyData file</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script>
import LungVolume from './components/LungVolume.vue';

export default {
  name: 'App',
  components: {
    LungVolume,
  },
  data() {
    return {
      drawerOpen: false,
    };
  },
};
</script>
