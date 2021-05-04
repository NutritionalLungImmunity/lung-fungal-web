<template>
  <v-app>
    <v-app-bar
      app
      clipped-left
    >
      <v-toolbar-title>
        Nutritional Lung Immunity Simulations
      </v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <v-tabs
          background-color="transparent"
          height="64"
        >
          <v-tab
            v-if="girderRest.user !== null"
            :to="`/configure?${query}`"
          >
            Configuration
          </v-tab>
          <v-tab :to="`/simulations?${query}`">
            Simulations
          </v-tab>
          <v-tab :to="`/experiments?${query}`">
            Experiments
          </v-tab>
        </v-tabs>
      </v-toolbar-items>
      <login-dialog />
    </v-app-bar>

    <v-container
      class="pa-0"
      fluid
    >
      <keep-alive>
        <router-view />
      </keep-alive>
    </v-container>
  </v-app>
</template>

<script>
import LoginDialog from '@/components/LoginDialog.vue';

export default {
  name: 'App',
  inject: ['girderRest'],
  components: {
    LoginDialog,
  },
  computed: {
    query() {
      return this.$route.fullPath.split('?')[1] || '';
    },
  },
};
</script>

<style>
.v-application--wrap {
  background: #dcdcdc;
}

html {
  overflow-y: hidden;
}
</style>
