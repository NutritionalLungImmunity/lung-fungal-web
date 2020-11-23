import Router from 'vue-router';

import ConfigPage from '@/pages/ConfigPage.vue';
import ComparePage from '@/pages/ComparePage.vue';
import SimulationListPage from '@/pages/SimulationListPage.vue';
import ViewerPage from '@/pages/ViewerPage.vue';

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/configure',
    },
    {
      path: '/configure',
      name: 'configuration',
      component: ConfigPage,
    },
    {
      path: '/simulations',
      name: 'simulations',
      component: SimulationListPage,
    },
    {
      path: '/viewer/:id',
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
