<template>
  <v-dialog
    v-model="enabled"
    scrollable
    max-width="500px"
    transition="dialog-transition"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        block
        color="primary"
        depressed
        tile
        x-large
        v-on="on"
      >
        Add filter
        <v-icon right>
          mdi-launch
        </v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        Create a new filter
        <v-card-text class="pa-0">
          <v-list class="py-0">
            <v-list-item class="pt-2 px-6">
              <v-text-field
                label="derp"
                outlined
              />
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card-title>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      enabled: false,
    };
  },
};
</script>
