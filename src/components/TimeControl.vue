<template>
  <v-layout row>
    <v-toolbar-items>
      <v-flex xs12>
        <v-slider
          id="sliderTP"
          v-model="tpIndex"
          :max="max"
        />
      </v-flex>
    </v-toolbar-items>
    <v-toolbar-items>
      <v-flex
        xs12
        sm6
        md3
      >
        <v-text-field
          id="currentTP"
          v-model="tpIndex"
          :value="timepoints[tpIndex]" />
      </v-flex>
      <p id="fraction">
        / {{ max }}
      </p>
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
        @click="toggle()"
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
    </v-toolbar-items>
  </v-layout>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';

import http from '@/http';

export default {
  name: 'TimeControl',
  data() {
    return {
      playstatus: 'play_arrow',
      max: 0,
      tpIndex: 0,
      timepoints: [],
      timepointsInfo: {},
    };
  },
  watch: {
    tpIndex(val) {
      if (val >= 0 && val <= this.max) {
        this.loadTimepoint(this.timepoints[val]);
        this.tpIndex = val;
      }
    },
  },
  methods: {
    init(timepoints, timepointsInfo) {
      this.timepoints = timepoints;
      this.timepointsInfo = timepointsInfo;
      this.loadTimepoint('000');
      setInterval(this.play, 500);
      this.max = this.timepoints.length - 1;
    },
    async loadTimepoint(timepoint) {
      const dataUrl = dataFile => `https://data.computational-biology.org/api/v1/file/${dataFile}/download`;
      const timepointInfo = this.timepointsInfo[timepoint];
      const timepointFolderID = timepointInfo.id;

      const timepointFiles = await this.getTPData(timepointFolderID);
      this.loadGeometryDataUrl({ fileUrl: dataUrl(timepointFiles.geometry) });
      this.loadSporeDataUrl({ fileUrl: dataUrl(timepointFiles.spore) });
      this.loadMacrophageDataUrl({ fileUrl: dataUrl(timepointFiles.macrophage) });
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
    toggle() {
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
    next() {
      if (this.tpIndex < this.timepoints.length) {
        this.tpIndex += 1;
        this.loadTimepoint(this.timepoints[this.tpIndex]);
      }
    },
    previous() {
      if (this.tpIndex > 0) {
        this.tpIndex -= 1;
        this.loadTimepoint(this.timepoints[this.tpIndex]);
      }
    },
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
