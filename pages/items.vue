<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-card v-if="items">
      <v-card-title>
        <span class="headline">商品一覧</span>
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
        :items="items"
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
                          v-model="item.name" 
                          label="表示名" />
                      </v-col>
                      <v-col cols="6">
                        <v-text-field 
                          v-model="item.yomi" 
                          label="ヨミ" />
                      </v-col>
                      <v-col cols="6">
                        <v-switch 
                          v-model="item.coolFlg" 
                          label="要冷蔵" />
                      </v-col>
                      <v-col cols="6">
                        <v-switch 
                          v-model="item.orderFlg" 
                          label="受注" />
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          v-model="variation" 
                          label="バリエーション" />
                      </v-col>
                      <v-col cols="6">
                        <v-btn 
                          color="secondary" 
                          v-on:click.prevent="addVariation(variation)">
                          追加
                        </v-btn>
                      </v-col>
                      <v-col cols="6">
                        {{item.variations}}
                      </v-col>
                      <v-col cols="6">
                        <v-btn v-if="item.variations"
                          color="secondary" 
                          v-on:click.prevent="removeVariation">
                          削除
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form> 
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                  <v-btn @click="close">閉じる</v-btn>
                  <v-btn v-if="isPersistedItem" class="primary" @click="update(item)">更新する</v-btn>
                  <v-btn v-else class="primary" @click="create(item)">追加する</v-btn>
                <v-spacer />
              </v-card-actions>
            </v-card>
          </v-dialog>
        </template>
        <template v-slot:item.coolFlg="{ item }">
          <v-icon v-if="item.coolFlg" small >mdi-check-bold</v-icon>
        </template>
        <template v-slot:item.orderFlg="{ item }">
          <v-icon v-if="item.orderFlg" small >mdi-power-off</v-icon>
          <v-icon v-else small >mdi-close-thick</v-icon>
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
            { text: '表示名', value: 'name' },
            { text: 'ヨミ', value: 'yomi' },
            { text: '要冷蔵', value: 'coolFlg' },
            { text: '受注', value: 'orderFlg' },
            { text: 'バリエーション', value: 'variations' },
            { text: '操作', value: 'actions' }
          ],
          item: {},
          variation: '',
        }
    },
    created: function() {
        this.$store.dispatch('items/init')
    },
    computed: {
        items () {
            return this.$store.getters['items/getItems']
          },
        isPersistedItem() {
          return this.item.id
        },
        formTitle () {
          return this.isPersistedItem ? '商品編集' : '商品追加'
        },
    },
    methods: {
        edit (item) {
          this.item = _.cloneDeep(item)
          this.item.id = item.id
          this.variation = ''
          this.dialog = true
        },
        add() {
            this.item = {coolFlg: false, orderFlg: true, variations: ''}
            this.dialog = true
        },
        create(item){
          this.$store.dispatch('items/create', item)
          this.close()
        },
        remove(id) {
            this.$store.dispatch('items/remove', id)
        },
        close () {
          this.dialog = false
          this.item = {}
        },
        update (item) {
          this.$store.dispatch('items/update', item)
          this.close()
        },
        addVariation (variation) {
          if (this.item.variations != '') {
            variation = ',' + variation
          }
          this.item.variations = this.item.variations + variation
          this.variation = ''
        },
        removeVariation () {
          this.item.variations = ''
        }
    }
}
</script>