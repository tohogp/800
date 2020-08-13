<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-card v-if="stores">
      <v-card-title>
        <span class="headline">ストア一覧</span>
        <v-spacer />
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="検索"
          sigle-line
        />
        <v-spacer />
          <v-btn fab primary small color="primary" class="mb-2"
            @click="add"
          >
            <v-icon primary> mdi-plus </v-icon>
          </v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="stores"
        :items-per-page="5"
        :search="search"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-dialog v-model="dialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-form>
                  <v-container>
                    <v-row>
                      <v-col cols="6">
                        <v-text-field 
                          v-model="store.name" 
                          label="店名" 
                          required />
                      </v-col>
                      <v-col cols="6">
                        <v-text-field 
                          v-model="store.manager" 
                          label="店長" 
                          required />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field v-model="store.memo" label="メモ" />
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form> 
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                  <v-btn @click="close">閉じる</v-btn>
                  <v-btn v-if="isPersistedStore" class="primary" @click="update(store)">更新する</v-btn>
                  <v-btn v-else class="primary" @click="create(store)">追加する</v-btn>
                <v-spacer />
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon
            small
            @click="edit(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            small
            @click="remove(item.id)"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
  </v-layout>
</template>

<script>
export default {
    data: function() {
        return {
          dialog: false,
          search: '',
          headers: [
            { text: 'ID', value: 'id' },
            { text: '店舗', value: 'name' },
            { text: '店長', value: 'manager' },
            { text: 'メモ', value: 'memo' },
            { text: '操作', value: 'actions' }
          ],
          store: {},
        }
    },
    created: function() {
        this.$store.dispatch('stores/init')
    },
    computed: {
        stores () {
            return this.$store.getters['stores/getStores']
          },
        isPersistedStore() {
          return this.store.id
        },
        formTitle () {
          return this.isPersistedStore ? 'ストア編集' : 'ストア追加'
        },
    },
    methods: {
        edit (store) {
          this.store = _.cloneDeep(store)
          this.store.id = store.id
          this.dialog = true
        },
        add() {
            this.store = {}
            this.dialog = true
        },
        create(store){
          this.$store.dispatch('stores/create', store)
          this.close()
        },
        remove(id) {
            this.$store.dispatch('stores/remove', id)
        },
        close () {
          this.dialog = false
          this.store = {}
        },
        update (store) {
          this.$store.dispatch('stores/update', store)
          this.close()
        },
    }
}
</script>