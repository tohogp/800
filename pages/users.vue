<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-card v-if="users">
      <v-card-title>
        <span class="headline">ユーザー一覧</span>
        <v-spacer />
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="検索"
          sigle-line
        />
        <v-spacer />
        <!-- <template v-slot:activator="{ on }"> -->
          <v-btn fab primary small color="primary" class="mb-2"
            @click="add"
          >
            <v-icon primary> mdi-plus </v-icon>
          </v-btn>
        <!-- </template> -->
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="users"
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
                <v-container>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field v-model="user.email" label="メールアドレス" />
                    </v-col>
                    <v-col cols="6">
                      <v-text-field v-model="user.name" label="名前" />
                    </v-col>
                    <v-col cols="12">
                      <v-select 
                        v-model="user.store" 
                        :items="stores"
                        item-text="name" 
                        item-value="id"
                        attach chips label="店舗" multiple
                      >
                      </v-select>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field v-model="user.memo" label="メモ" />
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                  <v-btn @click="close">閉じる</v-btn>
                  <v-btn v-if="isPersistedUser" class="primary" @click="update(user)">更新する</v-btn>
                  <v-btn v-else class="primary" @click="create(user)">追加する</v-btn>
                <v-spacer />
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
        <template v-slot:item.store="{ item }">
          <v-chip x-small v-for="store in item.store">
            {{ storeName(store) }}
          </v-chip>
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
  data () {
    return {
      dialog: false,
      search: '',
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'メールアドレス', value: 'email' },
        { text: '名前', value: 'name' },
        { text: '店舗', value: 'store' },
        { text: 'メモ', value: 'memo' },
        { text: '操作', value: 'actions' }
      ],
      user: {},
    }
  },
  created: function() {
    this.$store.dispatch('users/init')
  },
  computed: {
    users () {
      return this.$store.getters['users/getUsers']
    },
    stores () {
      return this.$store.getters['users/getStores']
    },
    isPersistedUser () {
      return !!this.user.id
    },
    formTitle () {
      return this.isPersistedUser ? 'ユーザー編集' : 'ユーザー追加'
    }
  },
  methods: {
    edit (user) {
      this.user = _.cloneDeep(user)
      this.user.id = user.id
      this.dialog = true
    },
    update (user) {
      this.$store.dispatch('users/update', user)
      this.close()
    },
    remove (user) {
      this.$store.dispatch('users/remove', user)
    },
    close () {
      this.dialog = false
      this.user = {}
    },
    add (user) {
      this.user = {}
      this.dialog = true
    },
    create (user) {
      this.$store.dispatch('users/create', user)
      this.close()
    },
    storeName (store_id) {
      const store = this.stores.find((s) => s.id === store_id)
      return store ? store.name : '店舗が見つかりません'
    },
  }
}
</script>