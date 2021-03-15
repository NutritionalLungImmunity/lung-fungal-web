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
    async getSimulation(id) {
      const { data } = await this.get(`nli/simulation/${id}`);
      return data;
    },
    async archiveSimulation(id) {
      await this.post(`nli/simulation/${id}/archive`);
    },
    async runSimulation(params, config) {
      const { data } = await this.post('nli/job', config, { params });
      return data;
    },
  },
);

export default http;
export { girderApi };
