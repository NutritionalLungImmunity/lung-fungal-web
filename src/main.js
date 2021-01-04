import Vue from 'vue';
import Router from 'vue-router';
import VueAsyncComputed from 'vue-async-computed';

import '@/plugins/static';
import GirderProvider from '@/plugins/girder';

import App from '@/App.vue';
import http from '@/http';
import vuetify from '@/plugins/vuetify';
import router from '@/router';

Vue.use(Router);
Vue.use(VueAsyncComputed);

http.fetchUser().then(() => {
  window.nli_app = new Vue({
    provide: GirderProvider,
    router,
    vuetify,
    render: (h) => h(App),
  }).$mount('#app');
});
