import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    polyData: null,
  },
  mutations: {
    setPolyData(state, polyData) {
      state.polyData = polyData;
      // console.log('updated', polyData);
    },
  },
  actions: {
  },
});
