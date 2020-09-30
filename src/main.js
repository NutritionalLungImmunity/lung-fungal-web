import Vue from 'vue';
import Router from 'vue-router';
import VueAsyncComputed from 'vue-async-computed';

import '@/plugins/static';
import GirderProvider from '@/plugins/girder';

import App from '@/App.vue';
import vuetify from '@/plugins/vuetify';
import router from '@/router';
import store from '@/store';

Vue.use(Router);
Vue.use(VueAsyncComputed);

window.nli_app = new Vue({
  provide: GirderProvider,
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
