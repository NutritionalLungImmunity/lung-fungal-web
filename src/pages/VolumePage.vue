<template>
  <v-app>
    <v-toolbar
      app
    >
      <v-toolbar-title>
        FLungGui
      </v-toolbar-title>
      <v-spacer />
      <TimeControl/>
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
import { mapMutations, mapActions } from 'vuex';

// import LocalFile from '@/components/LocalFile.vue';
import LungVolume from '@/components/LungVolume.vue';
import TimeControl from '@/components/TimeControl.vue';
import http from '@/http';

export default {
  name: 'VolumePage',
  components: {
    // LocalFile,
    LungVolume,
    TimeControl,
  },
  data() {
    return {
      drawerOpen: false,
      // TODO: set this from store errors
      dialog: false,
      dialogHeader: '',
      dialogMessage: '',
      timepointsInfo: {},
      timepoints: [],
    };
  },
  computed: {
    sortedTimepoints() {
      const tempTimepoints = this.timepoints.slice();
      return tempTimepoints.sort();
    },
  },
  async created() {
    await this.getTPs();
  },
  methods: {
    async getTPs() {
      const rootID = '5cf18200ef2e260353a51922';

      const timepointInfo = (await http.get(`folder/${rootID}/details`)).data;
      const timepointFolders = (await http.get('folder', {
        params: {
          parentType: 'folder',
          parentId: rootID,
          limit: timepointInfo.nItems,
        },
      })).data;

      for (let i = 0; i < timepointFolders.length; i += 1) {
        const timepoint = {
          index: i,
          id: timepointFolders[i]._id,
        };
        this.timepointsInfo[timepointFolders[i].name] = timepoint;
        this.timepoints.push(timepointFolders[i].name);
      }
    },
    async getTPData(TPFolderID) {
      const dataItems = (await http.get('item', {
        params: {
          folderId: TPFolderID,
        },
      })).data;
      const dataFilesPromises = dataItems.map(dataItem => http.get(`item/${dataItem._id}/files`));
      const dataFilesResponses = await (Promise.all(dataFilesPromises));
      const dataFiles = dataFilesResponses.map(dataFileResponse => dataFileResponse.data);

      const dataFilesIDs = {};
      for (let i = 0; i < dataFiles.length; i += 1) {
        const dataFile = dataFiles[i][0];
        dataFilesIDs[dataFile.name.substring(0, dataFile.name.indexOf('_'))] = dataFile._id;
      }
      return dataFilesIDs;
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

<style>
#fraction {
  margin-top: 16px;
  margin-left: 7px;
  font-size: 12pt;
}
#currentTP {
  max-width: 75px;
  text-align: right;
}
#sliderTP {
  margin-top: 15px;
  margin-right: 20px;
}
</style>
