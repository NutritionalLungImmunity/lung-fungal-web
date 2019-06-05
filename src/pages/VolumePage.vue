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
        <v-flex xs12>
          <v-slider
            v-model="currentTP"
            max="150"
            id="sliderTP"
          ></v-slider>
        </v-flex>
      </v-toolbar-items>
      <v-toolbar-items>
        <v-flex xs12 sm6 md3>
          <v-text-field
            v-model="currentTP"
            id="currentTP"
          ></v-text-field>
        </v-flex>
        <p id="fraction">/ 150</p>
      </v-toolbar-items>
      <v-spacer />
      <v-toolbar-items>
        <v-btn
          flat
          icon
          color="black"
          @click="previous()"
        >
          <v-icon>skip_previous</v-icon>
        </v-btn>
        <v-btn
          flat
          icon
          color="black"
          @click="togglestatus()"
        >
          <v-icon>{{ playstatus }}</v-icon>
        </v-btn>
        <v-btn
          flat
          icon
          color="black"
          @click="next()"
        >
          <v-icon>skip_next</v-icon>
        </v-btn>
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
    <v-footer>
        <v-flex xs12>
          <v-slider
            v-model="currentTP"
            max="150"
            id="sliderTP"
          ></v-slider>
        </v-flex>
    </v-footer>
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

import http from '@/http';
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
      timepointsIDs: {},
      timepoints: [],
      playstatus: 'play_arrow',
      currentTP: 0,
    };
  },
  computed: {
    sortedTimepoints() {
      const tempTimepoints = this.timepoints.slice();
      return tempTimepoints.sort();
    },
  },
  watch: {
    currentTP: function (val) {
      this.loadTimepoint(this.convertNum(val))
    }
  },
  async created() {
    await this.getTPs();
    this.loadTimepoint('000');
    setInterval(this.play, 500);
  },
  methods: {
    togglestatus() {
      if (this.playstatus === 'play_arrow') {
        this.playstatus = 'pause';
      } else if (this.playstatus === 'pause') {
        this.playstatus = 'play_arrow';
      } else {
        throw new Error(`unknown status: ${this.playstatus}`);
      }
    },
    play() {
      if (this.playstatus === 'pause') {
        this.next();
      }
    },
    convertNum(num) {
      const stringNum = `00${num.toString(10)}`;
      return stringNum.substring(stringNum.length - 3);
    },
    next() {
      if (this.currentTP < 150) {
        this.currentTP += 1;
        this.loadTimepoint(this.convertNum(this.currentTP));
      }
    },
    previous() {
      if (this.currentTP > 0) {
        this.currentTP -= 1;
        this.loadTimepoint(this.convertNum(this.currentTP));
      }
    },
    async loadTimepoint(timepoint) {
      this.currentTP = parseInt(timepoint, 10);
      const dataUrl = dataFile => `https://data.computational-biology.org/api/v1/file/${dataFile}/download`;
      const timepointFolderID = this.timepointsIDs[timepoint];

      const timepointFiles = await this.getTPData(timepointFolderID);
      this.loadGeometryDataUrl({ fileUrl: dataUrl(timepointFiles.geometry) });
      this.loadSporeDataUrl({ fileUrl: dataUrl(timepointFiles.spore) });
      this.loadMacrophageDataUrl({ fileUrl: dataUrl(timepointFiles.macrophage) });
    },
    async getTPs() {
      const timepointFolderIDs = this.timepointsIDs;
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
        timepointFolderIDs[timepointFolders[i].name] = timepointFolders[i]._id;
        this.timepoints.push(timepointFolders[i].name);
      }
    },
    async getTPData(TPFolderID) {
      const dataItems = (await http.get('item', {
        params: {
          folderId: TPFolderID,
        },
      })).data;
      const dataFilesPromises = dataItems.map((dataItem) => http.get(`item/${dataItem._id}/files`));
      const dataFilesResponses = await Promise.all(dataFilesPromises);
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
