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
import axios from 'axios'

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
      http: axios.create({
        baseURL: 'https://data.computational-biology.org/api/v1/'
      })
    };
  },
  computed: {
    sortedTimepoints() {
      return this.timepoints.sort()
    },
  },
  async created() {
    await this.getTPs()
    this.loadTimepoint('000');
  },
  methods: {
    async loadTimepoint(timepoint) {
      const dataUrl = dataFile => `https://data.computational-biology.org/api/v1/file/${dataFile}/download`;
      const timepointFolderID = this.timepointsIDs[timepoint];

      const timepointFiles = await this.getTPData(timepointFolderID)
      this.loadGeometryDataUrl({ fileUrl: dataUrl(timepointFiles.geometry) });
      this.loadSporeDataUrl({ fileUrl: dataUrl(timepointFiles.spore) });
      this.loadMacrophageDataUrl({ fileUrl: dataUrl(timepointFiles.macrophage) });
    },
    async getTPs () {
      try {
        let timepointFolderIDs = this.timepointsIDs

        const timepointFolders = (await this.http.get('folder', {
          params: {
            parentType: 'folder',
            parentId: '5cb56d8cef2e260353a50f04'
          }
        })).data

        for (let i = 0; i < timepointFolders.length; i++) {
          timepointFolderIDs[timepointFolders[i].name] = timepointFolders[i]._id
          this.timepoints.push(timepointFolders[i].name)
        }
      } catch (err) {
        console.error(err)
      }
    },
    async getTPData (TPFolderID) {
      try {
        const dataItems = (await this.http.get('item', {
          params: {
            folderId: TPFolderID
          }
        })).data
        const dataFilesPromises = dataItems.map((dataItem) => {
          const path = 'item/' + dataItem._id + '/files'
          return this.http.get(path)
        })
        const dataFilesResponses = await Promise.all(dataFilesPromises)
        const dataFiles = dataFilesResponses.map((dataFileResponse) => dataFileResponse.data)

        let dataFilesIDs = {}
        for (let i = 0; i < dataFiles.length; i++) {
          const dataFile = dataFiles[i][0]
          var fullname = dataFile.name
          dataFilesIDs[fullname.substring(0, fullname.length - 8)] = dataFile._id
        }
        return dataFilesIDs
      } catch (err) {
        console.error(err)
      }
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
