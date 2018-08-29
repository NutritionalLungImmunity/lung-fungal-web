import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// TODO: Move this to base config or get https://github.com/vuejs-templates/webpack/pull/1003
/* eslint no-param-reassign: [
    "error", {"props": true, "ignorePropertyModificationsFor": ["state"]}] */

export default new Vuex.Store({
  state: {
    polyData: null,
  },
  mutations: {
    setPolyData(state, polyData) {
      state.polyData = polyData;
      console.log('updated', polyData);
    },
  },
  actions: {
  },
});
