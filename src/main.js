import Vue from 'vue';
import Router from 'vue-router';


import '@/plugins/static';

import App from '@/App.vue';
import vuetify from '@/plugins/vuetify';
import router from '@/router';
import store from '@/store';

Vue.use(Router);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
