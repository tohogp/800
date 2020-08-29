import firebase from '~/plugins/firebase'
import { firestoreAction } from 'vuexfire'

const db = firebase.firestore()
const usersRef = db.collection('users')
const storesRef = db.collection('stores')

export const state = () => ({
  users: [],
  stores: []
})



export const getters = {
  getUsers: state => {
    return _.sortBy(state.users, 'created')
  },
  getStores: state => {
    return _.sortBy(state.stores, 'name')
  },
}

export const actions = {
  init: firestoreAction(({ bindFirestoreRef }) => {
    bindFirestoreRef('users', usersRef),
    bindFirestoreRef('stores', storesRef)
  }),
  create: firestoreAction((context, user) => {
    if(user.name.trim()) {
      usersRef.add({
        name: user.name,
        email: user.email,
        store: user.store,
        memo: user.memo,
        created: firebase.firestore.FieldValue.serverTimestamp()
      })
    }
  }),
  update: firestoreAction((context, user) => {
    if(user.name.trim()) {
      usersRef.doc(user.id).update({
        name: user.name,
        email: user.email,
        store: user.store,
        memo: user.memo,
        updated: firebase.firestore.FieldValue.serverTimestamp()
      })
    }
  }),
  remove: firestoreAction((context, id) => {
    usersRef.doc(id).delete()
  })
}  