import axiosRetry from 'axios-retry';

import { RestClient } from '@girder/components/src';

const girderApi = (new URL('/api/v1', process.env.VUE_APP_GIRDER_API)).href;
const http = new RestClient({ apiRoot: girderApi });
axiosRetry(
  http,
  { retries: 5, retryDelay: axiosRetry.exponentialDelay },
);

Object.assign(
  http,
  {
    async listSimulations(sortBy, sortDesc) {
      const { data } = await this.get('nli/simulation', {
        params: {
          sort: sortBy,
          sortdir: sortDesc ? -1 : 1,
        },
      });
      return data;
    },
    async listExperiments(sortBy, sortDesc) {
      const { data } = await this.get('nli/experiment', {
        params: {
          sort: sortBy,
          sortdir: sortDesc ? -1 : 1,
        },
      });
      return data;
    },
    async getSimulation(id) {
      const { data } = await this.get(`nli/simulation/${id}`);
      return data;
    },
    async getExperiment(id) {
      const { data } = await this.get(`nli/experiment/${id}`);
      return data;
    },
    async getExperiment2DData(id) {
      // As of 26May2021, the respose will have the sections:
      // ['experimental_group_params',
      //  'experiment_complete',
      //  'names',
      //  'runs_per_config',
      //  'simulation config',
      //  'simulation completion',
      //  'simulation group map',
      //  'stats']
      const { data } = await this.get(`nli/experiment/${id}/json`);
      return data;
    },
    async archiveSimulation(id) {
      await this.post(`nli/simulation/${id}/archive`);
    },
    async runSimulation(params, config) {
      // single-value parameters get packed into length 1 arrays to support
      // the possibility of multi-value paramters, we unpack them here
      const unpackedConfig = {};
      Object.entries(config).forEach(([moduleName, moduleParams]) => {
        unpackedConfig[moduleName] = {};
        Object.entries(moduleParams).forEach(([paramName, paramValue]) => {
          if (Array.isArray(paramValue)) {
            const [value] = paramValue;
            unpackedConfig[moduleName][paramName] = value;
          } else {
            unpackedConfig[moduleName][paramName] = paramValue;
          }
        });
      });
      const { data } = await this.post('nli/job', unpackedConfig, { params });
      return data;
    },
    async runExperiment(params, config) {
      const { data } = await this.post('nli/experiment', config, { params });
      return data;
    },
  },
);

export default http;
export { girderApi };
