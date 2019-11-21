<template>
  <v-dialog
    v-model="dialog"
    width="800"
  >
    <template #activator="{ on }">
      <v-btn
        text
        v-on="on"
      >
        Metadata
      </v-btn>
    </template>
    <v-card>
      <v-card-title
        class="headline grey lighten-2"
      >
        Metadata
        <v-spacer />
        <v-text-field
          id="searchbar"
          v-model="search"
          append-icon="search"
          label="Search"
          height="10"
          single-line
          hide-details
        />
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="vars"
          :search="search"
          hide-default-footer
          class="elevation-1"
        >
          <template v-slot:items="props">
            <td>{{ props.item.name }}</td>
            <td class="text-right">
              {{ props.item.val }}
            </td>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          @click="dialog = false"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import http from '@/http';

export default {
  name: 'MetadataPanel',
  data() {
    return {
      headers: [
        {
          text: 'Variables',
          value: 'name',
        },
        {
          text: 'Value',
          value: 'val',
          align: 'right',
          sortable: false,
        },
      ],
      vars: [],
      dialog: false,
      search: '',
    };
  },
  async created() {
    const rootID = '5cb5d24cef2e260353a50f1a';
    const fileName = 'params.json';

    const metadataItem = (await http.get('item', {
      params: {
        folderId: rootID,
        name: fileName,
      },
    })).data[0];

    const metadataFileID = (await http.get(`item/${metadataItem._id}/files`)).data[0];

    const params = (await http.get(`file/${metadataFileID._id}/download`)).data;
    const variables = Object.keys(params);

    this.vars = variables.map((key) => ({
      name: key,
      val: params[key],
    }));
  },
};
</script>

<style>
#searchbar {
  min-height: 10px !important;
  margin-bottom: 15px;
}
.v-input__icon--append .v-icon {
  margin-bottom: 40px;
}
</style>
