<template>
  <v-app>
    <v-toolbar
      app
    >
      <v-toolbar-title>
        FLungGui
      </v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <v-btn
          disabled
          flat
          @click.stop="drawerOpen = !drawerOpen"
        >
          Load data
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <LungVolume/>
    </v-content>
    <v-navigation-drawer
      v-model="drawerOpen"
      temporary
      right
      fixed
      app
    >
      <v-list>
        <v-list-tile @click="true">
          <v-list-tile-content>
            <v-list-tile-title>Upload a VTK ImageData file</v-list-tile-title>
            <LocalFile
              accept="*.vti"
              @load="fileLoaded"
              @error="fileLoadFailed"
            />
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
import { mapMutations, mapActions } from 'vuex';

import LocalFile from '@/components/LocalFile.vue';
import LungVolume from '@/components/LungVolume.vue';

export default {
  name: 'VolumePage',
  components: {
    LocalFile,
    LungVolume,
  },
  data() {
    return {
      drawerOpen: false,
      // TODO: set this from store errors
      dialog: false,
      dialogHeader: '',
      dialogMessage: '',
    };
  },
  created() {
    const dataFiles = {
      '000': {
        geometry: '5cb56dd4ef2e260353a50f08',
        spore: '5cb56f28ef2e260353a50f0f',
        macrophage: '5cb56f33ef2e260353a50f12',
      },
      '001': {
        geometry: '5cb56e0bef2e260353a50f0c',
        spore: '5cb56f52ef2e260353a50f15',
        macrophage: '5cb56f5aef2e260353a50f18',
      },
    };
    const dataUrl = dataFile => `https://data.computational-biology.org/api/v1/file/${dataFile}/download`;

    const fileNum = '001';

    this.loadGeometryDataUrl({ fileUrl: dataUrl(dataFiles[fileNum].geometry) });
    this.loadSporeDataUrl({ fileUrl: dataUrl(dataFiles[fileNum].spore) });
    this.loadMacrophageDataUrl({ fileUrl: dataUrl(dataFiles[fileNum].macrophage) });
  },
  methods: {
    /**
     * @param {ArrayBuffer} arrayBuffer
     */
    fileLoaded(arrayBuffer) {
      this.loadGeometryData({ arrayBuffer });
    },
    fileLoadFailed(message) {
      this.setGeometryError({ error: message });
    },
    ...mapActions({
      loadGeometryData: 'geometry/loadImageData',
      loadGeometryDataUrl: 'geometry/loadImageDataUrl',
      loadSporeData: 'spore/loadPolyData',
      loadSporeDataUrl: 'spore/loadPolyDataUrl',
      loadMacrophageData: 'macrophage/loadPolyData',
      loadMacrophageDataUrl: 'macrophage/loadPolyDataUrl',
    }),
    ...mapMutations({
      setGeometryError: 'geometry/setError',
      setSporeError: 'spore/setError',
      setMacrophageError: 'macrophage/setError',
    }),
  },
};
</script>
