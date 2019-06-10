<template>
  <v-app>
    <v-toolbar
      app
    >
      <v-toolbar-title>
        FLungGui
      </v-toolbar-title>
      <v-toolbar-items class="toolbar-items">
        <TimeControl
          ref="tc"
          :timepoints="timepoints"
          :timepoints-info="timepointsInfo"/>
        <MetadataPanel/>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <LungVolume/>
    </v-content>
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title>{{ dialogHeader }}</v-card-title>
        <v-card-text style="white-space: pre;">{{ dialogMessage }}</v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import LungVolume from '@/components/LungVolume.vue';
import TimeControl from '@/components/TimeControl.vue';
import MetadataPanel from '@/components/MetadataPanel.vue';
import http from '@/http';

export default {
  name: 'VolumePage',
  components: {
    LungVolume,
    TimeControl,
    MetadataPanel,
  },
  data() {
    return {
      drawerOpen: false,
      // TODO: set this from store errors
      dialog: false,
      dialogHeader: '',
      dialogMessage: '',
      timepoints: [],
      timepointsInfo: {},
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
        this.$set(this.timepointsInfo, timepointFolders[i].name, timepoint);
        this.timepoints.push(timepointFolders[i].name);
      }
      this.$refs.tc.init();
    },
  },
};
</script>

<style scoped>
.toolbar-items{
  width: 100%;
}
</style>
