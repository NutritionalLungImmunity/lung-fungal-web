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
              <MeshLoader
                @load="meshLoaded"
                @error="meshLoadFailed"
              ></MeshLoader>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title>{{ dialogHeader }}</v-card-title>
        <v-card-text style="white-space: pre;">{{ dialogMessage }}</v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import { mapMutations } from 'vuex';

import MeshLoader from './components/MeshLoader.vue';
import LungVolume from './components/LungVolume.vue';

export default {
  name: 'App',
  components: {
    MeshLoader,
    LungVolume,
  },
  data() {
    return {
      drawerOpen: false,
      dialog: false,
      dialogHeader: '',
      dialogMessage: '',
    };
  },
  methods: {
    meshLoaded(polyData) {
      this.setPolyData(polyData);
    },
    meshLoadFailed(message) {
      this.dialog = true;
      this.dialogHeader = 'Error';
      this.dialogMessage = message;
    },
    ...mapMutations([
      'setPolyData',
    ]),
  },
};
</script>
