<template>
  <v-layout
    row
    align-right
    class="time-controls">
    <v-layout
      row
      xs5
    >
      <v-flex xs7>
        <v-slider
          v-model="tpIndex"
          :max="max"
          class="slider-tp"
        />
      </v-flex>
      <v-flex xs1>
        <v-text-field
          v-model="tpIndex"
          :value="timepoints[tpIndex]"
        />
      </v-flex>
      <span class="fraction">
        / {{ max }}
      </span>
    </v-layout>
    <v-flex
      xs3
      class="text-xs-center">
      <v-btn
        flat
        icon
        color="black"
        @click="previous"
      >
        <v-icon>skip_previous</v-icon>
      </v-btn>
      <v-btn
        flat
        icon
        color="black"
        @click="next"
      >
        <v-icon>skip_next</v-icon>
      </v-btn>
    </v-flex>
    <v-spacer />
    <v-flex
      xs4
      class="text-xs-right">
      <v-btn
        flat
        icon
        color="black"
        @click="rewind"
      >
        <v-icon>fast_rewind</v-icon>
      </v-btn>
      <v-btn
        flat
        icon
        color="black"
        @click="toggle"
      >
        <v-icon>{{ playing ? 'pause' : 'play_arrow' }}</v-icon>
      </v-btn>
      <v-btn
        flat
        icon
        color="black"
        @click="fastForward"
      >
        <v-icon>fast_forward</v-icon>
      </v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';

import http from '@/http';

export default {
  name: 'TimeControl',
  props: {
    timepoints: {
      type: Array,
      required: true,
    },
    timepointsInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      tpIndex: 0,
      speed: 500,
      intervalID: null,
      direction: true,
      playing: false,
    };
  },
  computed: {
    max() {
      return this.timepoints.length - 1;
    },
  },
  watch: {
    tpIndex(val) {
      if (val >= 0 && val <= this.max) {
        this.loadTimepoint(this.timepoints[val]);
      }
    },
  },
  methods: {
    init() {
      this.loadTimepoint('000');
    },
    async loadTimepoint(timepoint) {
      const dataUrl = dataFile => `https://data.nutritionallungimmunity.org/api/v1/file/${dataFile}/download`;
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
      clearInterval(this.intervalID);
      this.playing = !this.playing;
      this.speed = 500;
      this.direction = true;
      if (this.playing) {
        this.intervalID = setInterval(this.play, this.speed);
      }
    },
    play() {
      if (this.playing) {
        this.next();
      }
    },
    next() {
      this.direction = true;
      if (this.tpIndex < this.max) {
        this.tpIndex += 1;
        this.loadTimepoint(this.timepoints[this.tpIndex]);
      } else {
        clearInterval(this.intervalID);
        this.speed = 500;
        this.playing = false;
      }
    },
    previous() {
      this.direction = false;
      if (this.tpIndex > 0) {
        this.tpIndex -= 1;
        this.loadTimepoint(this.timepoints[this.tpIndex]);
      } else {
        clearInterval(this.intervalID);
        this.speed = 500;
        this.playing = false;
      }
    },
    rewind() {
      this.playing = true;
      clearInterval(this.intervalID);
      if (this.direction) {
        this.speed = 500;
      } else {
        this.speed /= 2;
      }
      this.direction = false;
      this.intervalID = setInterval(this.previous, this.speed);
    },
    fastForward() {
      this.playing = true;
      clearInterval(this.intervalID);
      if (this.direction) {
        this.speed /= 2;
      } else {
        this.speed = 500;
      }
      this.direction = true;
      this.intervalID = setInterval(this.play, this.speed);
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
.fraction {
  margin-top: 15px;
  margin-left: 7px;
  font-size: 13pt;
}
.slider-tp {
  padding-top: 8px;
  padding-right: 15px;
  padding-left: 15px;
}
.time-controls {
  padding-top: 8px;
  padding-bottom: 10px;
}
</style>
