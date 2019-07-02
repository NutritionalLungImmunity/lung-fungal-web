import Vue from 'vue';
import Router from 'vue-router';

import VolumePage from '@/pages/VolumePage.vue';
import PlotPage from '@/pages/PlotPage.vue';

const rootID = '5cf18200ef2e260353a51922';
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/volume',
      name: 'volume',
      component: VolumePage,
      props: { rootID },
    },
    {
      path: '/plot',
      name: 'plot',
      component: PlotPage,
      props: { rootID },
    },
  ],
});
