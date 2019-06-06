<template>
  <div>
    <v-toolbar-items>
      <v-btn
        flat
        @click.stop="dialog = true"
      >
        Metadata
      </v-btn>
    </v-toolbar-items>
    <v-dialog
      v-model="dialog"
      width="800"
    >
      <v-card>
        <v-card-title
          class="headline grey lighten-2"
          primary-title
        >
          Metadata
          <v-spacer/>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search"
            single-line
            hide-details
          />
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="vars"
            :pagination.sync="pagination"
            :search="search"
            class="elevation-1"
          >
            <template v-slot:items="props">
              <td>{{ props.item.name }}</td>
              <td class="text-xs-right">{{ props.item.val }}</td>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn
            flat="flat"
            @click="dialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
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
        },
      ],
      vars: [],
      dialog: false,
      search: '',
      pagination: {
        rowsPerPage: -1,
      },
    };
  },
  created() {
      // const rootID = '5cb5d24cef2e260353a50f1a';
      // const fileName = 'params.json';

      // const metadataItem = (await http.get('item', {
      //   params: {
      //     folderId: rootID,
      //     name: fileName,
      //   },
      // })).data;

      // const metadataFileID = (await http.get(`item/${metadataItem._id}/files`)).data;

      // await http.get(`file/${metadataFileID._id}/download`, {
      //   params: {
      //     name: fileName,
      //   }
      // })
      const params = require('./params.json');

      for(const key in params) {
        this.vars.push({
          name: key,
          val: params[key],
        });
      }

      console.log(this.vars);
      // $.getJSON(fileName, function(data) {
      //   $.each(data, function(key,val) {
      //     this.vars.push({
      //       variable: key,
      //       value: val,
      //     });
      //   });
      // });
  },
  methods: {
  },
};
</script>
