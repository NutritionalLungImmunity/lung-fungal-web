<template>
  <v-container fluid>
    <MeshLoader
      @load="meshLoaded"
      @error="meshLoadFailed"
      v-if="!polyData"
    ></MeshLoader>
    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title>{{ dialogHeader }}</v-card-title>
        <v-card-text style="white-space: pre;">{{ dialogMessage }}</v-card-text>
      </v-card>
    </v-dialog>
    <Render3D :polyData="polyData"></Render3D>
  </v-container>
</template>

<script>
import MeshLoader from './MeshLoader.vue';
import Render3D from './Render3D.vue';

export default {
  name: 'LungVolume',
  components: {
    MeshLoader,
    Render3D,
  },
  data() {
    return {
      dialog: false,
      dialogHeader: '',
      dialogMessage: '',
      polyData: null,
    };
  },
  props: {
  },
  methods: {
    meshLoaded(polyData) {
      this.polyData = polyData;
    },
    meshLoadFailed(message) {
      this.dialog = true;
      this.dialogHeader = 'Error';
      this.dialogMessage = message;
    },
  },
};
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
