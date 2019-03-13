import Vue from 'vue';
import Router from 'vue-router';

import VolumePage from '@/pages/VolumePage.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'volume',
      component: VolumePage,
    },
  ],
});
