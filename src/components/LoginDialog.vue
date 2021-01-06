<template>
  <v-dialog
    v-model="dialog"
    scrollable
    max-width="500px"
    transition="dialog-transition"
  >
    <template v-slot:activator="{ on }">
      <v-tooltip
        bottom
      >
        <template
          v-slot:activator="{ on: on_t, attrs }"
        >
          <v-btn
            class="mx-1"
            icon
            dark
            color="primary"
            v-bind="attrs"
            v-on="{ ...on, ...on_t }"
          >
            <v-icon
              v-if="!loggedIn"
            >
              mdi-login
            </v-icon>
            <v-icon
              v-else
            >
              mdi-account-circle
            </v-icon>
          </v-btn>
        </template>
        <span>Login</span>
      </v-tooltip>
    </template>
    <girder-authentication
      v-if="!loggedIn"
      :forgot-password-url="forgotPasswordUrl"
      :register="true"
      :oauth="true"
    />
    <v-card
      v-else
    >
      <v-card-title>Logout</v-card-title>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          color="primary"
          @click="logout"
        >
          Logout
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import GirderAuthentication from '@girder/components/src/components/Authentication';

const forgotPasswordUrl = 'https://data.nutritionallungimmunity.org/#?dialog=resetpassword';

export default {
  inject: ['girderRest'],
  components: {
    GirderAuthentication,
  },
  data() {
    return {
      forgotPasswordUrl,
      dialog: false,
    };
  },
  computed: {
    loggedIn() {
      return this.girderRest.user !== null;
    },
  },
  watch: {
    'girderRest.user': function girderRestUser() {
      this.dialog = false;
    },
  },
  methods: {
    logout() {
      this.girderRest.logout();
    },
  },
};
</script>
