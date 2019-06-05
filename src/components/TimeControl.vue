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
import http from '@/http';
import VolumePage from '@/pages/VolumePage.vue';

export default {
  name: 'TimeControl',
  data() {
    return {
      playstatus: 'play_arrow',
      max: 0,
      tpIndex: 0,
      timepoints: ['000'],
    };
  },
  created() {
    this.timepoints = VolumePage.timepoints;
    debugger
    this.loadTimepoint('000');
    setInterval(this.play, 500);
    this.max = this.timepoints.length - 1;
  }, 
  watch: {
    tpIndex(val) {
      if (val >= 0 && val <= this.max) {
        VolumePage.loadTimepoint(this.timepoints[val]);
        this.tpIndex = val;
      }
    },
  },
  methods: {
    async loadTimepoint(timepoint) {
      const dataUrl = dataFile => `https://data.computational-biology.org/api/v1/file/${dataFile}/download`;
      const timepointInfo = this.timepointsInfo[timepoint];
      const timepointFolderID = timepointInfo.id;

      const timepointFiles = await this.getTPData(timepointFolderID);
      this.loadGeometryDataUrl({ fileUrl: dataUrl(timepointFiles.geometry) });
      this.loadSporeDataUrl({ fileUrl: dataUrl(timepointFiles.spore) });
      this.loadMacrophageDataUrl({ fileUrl: dataUrl(timepointFiles.macrophage) });
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
        VolumePage.loadTimepoint(this.timepoints[this.tpIndex]);
      }
    },
    previous() {
      if (this.tpIndex > 0) {
        this.tpIndex -= 1;
        VolumePage.loadTimepoint(this.timepoints[this.tpIndex]);
      }
    },
    
  }
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
