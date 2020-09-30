import { RestClient } from '@girder/components/src';

const girderApi = (new URL('/api/v1', process.env.VUE_APP_GIRDER_API)).href;
const http = new RestClient({ apiRoot: girderApi });

Object.assign(
  http,
  {
    async listSimulations() {
      const { data } = await this.get('nli/simulation');
      return data;
    },
  },
);

export default http;
