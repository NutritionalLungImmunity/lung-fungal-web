import axios from 'axios';

import vtkXMLImageDataReader from 'vtk.js/Sources/IO/XML/XMLImageDataReader';

export default {
  namespaced: true,

  state() {
    return {
      imageData: null,
      error: null,
    };
  },
  mutations: {
    /**
     * @param {Object} state
     * @param {Object} payload
     * @param {vtkImageData} payload.imageData
     */
    setImageData(state, { imageData }) {
      state.imageData = imageData;
      state.loadProgress = null;
      state.error = null;
    },
    unsetImageData(state) {
      state.imageData = null;
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
      state.imageData = null;
      state.error = error;
    },
  },
  actions: {
    /**
     * @param {Object} context
     * @param {Object} payload
     * @param {ArrayBuffer} payload.fileBuffer
     */
    loadImageData({ commit }, { fileBuffer }) {
      const imageDataReader = vtkXMLImageDataReader.newInstance();

      const success = imageDataReader.parseAsArrayBuffer(fileBuffer);
      if (!success) {
        commit('setError', {
          error: 'File cannot be read as VTK ImageData.',
        });
        return;
      }

      const imageData = imageDataReader.getOutputData(0);
      commit('setImageData', { imageData });
    },

    async loadImageDataUrl({ commit, dispatch }, { fileUrl }) {
      // This will take some time
      commit('unsetImageData');
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
      dispatch('loadImageData', { fileBuffer });
    },
  },
};
