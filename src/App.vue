<template>
  <v-app>
    <v-app-bar
      app
      clipped-left
    >
      <v-toolbar-title>
        FLungGui
      </v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <v-tabs
          background-color="transparent"
          height="64"
        >
          <v-tab :to="`/configure?${query}`">
            Configuration
          </v-tab>
          <v-tab :to="`/simulations?${query}`">
            Simulations
          </v-tab>
          <v-tab :to="`/compare?${query}`">
            Compare
          </v-tab>
        </v-tabs>
      </v-toolbar-items>
    </v-app-bar>

    <v-container
      class="pa-0"
      fluid
    >
      <router-view />
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'App',
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
</style>
