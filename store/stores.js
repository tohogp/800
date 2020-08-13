import firebase from '~/plugins/firebase'
import { firestoreAction } from 'vuexfire'

const db = firebase.firestore()
const storesRef = db.collection('stores')

export const state = () => ({
  stores: []
})



export const getters = {
  getStores: state => {
    return _.sortBy(state.stores, 'created')
  },
}

export const actions = {
  init: firestoreAction(({ bindFirestoreRef }) => {
    bindFirestoreRef('stores', storesRef)
  }),
  create: firestoreAction((context, store) => {
    if(store.name.trim() && store.manager.trim()) {
      storesRef.add({
        name: store.name,
        manager: store.manager,
        memo: store.memo,
        created: firebase.firestore.FieldValue.serverTimestamp()
      })
    }
  }),
  update: firestoreAction((context, store) => {
    if(store.name.trim() && store.manager.trim()) {
      storesRef.doc(store.id).update({
        name: store.name,
        manager: store.manager,
        memo: store.memo,
        updated: firebase.firestore.FieldValue.serverTimestamp()
      })
    }
  }),
  remove: firestoreAction((context, id) => {
    storesRef.doc(id).delete()
  })
}  