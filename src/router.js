import Router from 'vue-router';

import ComparePage from '@/pages/ComparePage.vue';
import ConfigPage from '@/pages/ConfigPage.vue';
import SimulationListPage from '@/pages/SimulationListPage.vue';
import ViewerPage from '@/pages/ViewerPage.vue';

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/config',
    },
    {
      path: '/config',
      name: 'config',
      component: ConfigPage,
    },
    {
      path: '/simulations',
      name: 'simulations',
      component: SimulationListPage,
    },
    {
      path: '/viewer',
      name: 'viewer',
      component: ViewerPage,
    },
    {
      path: '/compare',
      name: 'compare',
      component: ComparePage,
    },
  ],
});
