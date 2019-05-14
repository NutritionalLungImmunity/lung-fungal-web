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
          flat
          @click.stop="drawerOpen = !drawerOpen"
        >
          Select time point
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <LungVolume/>
    </v-content>
    <v-navigation-drawer
      v-model="drawerOpen"
      right
      fixed
      app
    >
      <v-list>
        <!--
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
        -->

        <v-list-tile
          v-for="timepoint in sortedTimepoints"
          :key="timepoint"
          @click="loadTimepoint(timepoint)">
          <v-list-tile-content>
            <v-list-tile-title>{{ timepoint }}</v-list-tile-title>
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
import sortBy from 'lodash/sortBy';
import { mapMutations, mapActions } from 'vuex';

// import LocalFile from '@/components/LocalFile.vue';
import LungVolume from '@/components/LungVolume.vue';

export default {
  name: 'VolumePage',
  components: {
    // LocalFile,
    LungVolume,
  },
  data() {
    return {
      drawerOpen: false,
      // TODO: set this from store errors
      dialog: false,
      dialogHeader: '',
      dialogMessage: '',
      timepoints: {
        '000': {
          geometry: '5cda564eef2e260353a5190a',
          spore: '5cda564eef2e260353a51907',
          macrophage: '5cda564eef2e260353a51904',
        },
        '001': {
          geometry: '5cda565bef2e260353a51913',
          spore: '5cda565aef2e260353a51910',
          macrophage: '5cda565aef2e260353a5190d',
        },
        150: {
          geometry: '5cda5f0bef2e260353a5191e',
          spore: '5cda5f0bef2e260353a5191b',
          macrophage: '5cda5f0aef2e260353a51918',
        },
      },
    };
  },
  computed: {
    sortedTimepoints() {
      return sortBy(Object.keys(this.timepoints), parseInt);
    },
  },
  created() {
    this.loadTimepoint('000');
  },
  methods: {
    loadTimepoint(timepoint) {
      const dataUrl = dataFile => `https://data.computational-biology.org/api/v1/file/${dataFile}/download`;
      const timepointFiles = this.timepoints[timepoint];

      this.loadGeometryDataUrl({ fileUrl: dataUrl(timepointFiles.geometry) });
      this.loadSporeDataUrl({ fileUrl: dataUrl(timepointFiles.spore) });
      this.loadMacrophageDataUrl({ fileUrl: dataUrl(timepointFiles.macrophage) });
    },
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
