import axios from 'axios';

import vtkXMLPolyDataReader from 'vtk.js/Sources/IO/XML/XMLPolyDataReader';

export default {
  namespaced: true,

  state: {
    polyData: null,
    error: null,
  },
  mutations: {
    /**
     * @param {Object} state
     * @param {Object} payload
     * @param {vtkPolyData} payload.polyData
     */
    setPolyData(state, { polyData }) {
      state.polyData = polyData;
      state.loadProgress = null;
      state.error = null;
    },
    unsetPolyData(state) {
      state.polyData = null;
      state.loadProgress = null;
      state.error = null;
    },
    setLoadProgress(state, { loadProgress }) {
      state.loadProgress = loadProgress;
    },
    /**
     * @param {Object} state
     * @param {Object} payload
     * @param {string} payload.error
     */
    setError(state, { error }) {
      state.polyData = null;
      state.error = error;
    },
  },
  actions: {
    /**
     * @param {Object} context
     * @param {Object} payload
     * @param {ArrayBuffer} payload.fileBuffer
     */
    loadPolyData({ commit }, { fileBuffer }) {
      const polyDataReader = vtkXMLPolyDataReader.newInstance();

      const success = polyDataReader.parseAsArrayBuffer(fileBuffer);
      if (!success) {
        commit('setError', {
          error: 'File cannot be read as VTK PolyData.',
        });
        return;
      }

      const polyData = polyDataReader.getOutputData(0);
      commit('setPolyData', { polyData });
    },

    async loadPolyDataUrl({ commit, dispatch }, { fileUrl }) {
      // This will take some time
      commit('unsetPolyData');
      commit('setLoadProgress', { loadProgress: 0 });

      let fileResponse;
      try {
        fileResponse = await axios.request({
          method: 'GET',
          url: fileUrl,
          responseType: 'arraybuffer',
          onDownloadProgress: (progressEvent) => {
            if (progressEvent.lengthComputable) {
              const loadProgress = (progressEvent.loaded / progressEvent.total) * 100;
              commit('setLoadProgress', { loadProgress });
            }
          },
        });
      } catch (e) {
        // TODO
      }

      const fileBuffer = fileResponse.data;
      dispatch('loadPolyData', { fileBuffer });
    },
  },
};
