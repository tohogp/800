import firebase from '~/plugins/firebase'
import { firestoreAction } from 'vuexfire'

const db = firebase.firestore()
const itemsRef = db.collection('items')

export const state = () => ({
  items: []
})

export const getters = {
  getItems: state => {
    return _.sortBy(state.items, 'yomi')
  },
}

export const actions = {
  init: firestoreAction(({ bindFirestoreRef }) => {
    bindFirestoreRef('items', itemsRef)
  }),
  create: firestoreAction((context, item) => {
    if(item.name.trim() && item.yomi.trim()) {
      itemsRef.add({
        name: item.name,
        yomi: item.yomi,
        coolFlg: item.coolFlg,
        orderFlg: item.orderFlg,
        variations: item.variations,
        created: firebase.firestore.FieldValue.serverTimestamp()
      })
    }
  }),
  update: firestoreAction((context, item) => {
    if(item.name.trim() && item.yomi.trim()) {
      itemsRef.doc(item.id).update({
        name: item.name,
        yomi: item.yomi,
        coolFlg: item.coolFlg,
        orderFlg: item.orderFlg,
        variations: item.variations,
        updated: firebase.firestore.FieldValue.serverTimestamp()
      })
    }
  }),
  remove: firestoreAction((context, id) => {
    itemsRef.doc(id).delete()
  })
}  