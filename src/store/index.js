import Vue from 'vue';
import Vuex from 'vuex';

import polyData from '@/store/polyData';
import imageData from '@/store/imageData';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    geometry: imageData,
    spore: polyData,
    macrophage: polyData,
  },
});
