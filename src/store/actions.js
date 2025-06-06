import firebase from 'firebase/compat/app'
import firestore from '../firebase.js'

import { createFlatObject } from './models.js'

const db = {
  users: firestore.collection('users'),
  flats: firestore.collection('flats')
}

export default {
  async registerUser({ commit }, user) {
    commit('TOGGLE_LOADER', true)
    await db.users.doc(user.id).set(user)
    commit('SET_USER', user)
    commit('TOGGLE_LOADER', false)
  },
  async addItem({ commit, getters }, itemData) {
    commit('TOGGLE_LOADER', true)
    const flat = getters.currentFlat
    await db.flats
      .doc(flat.id)
      .collection('items')
      .add(itemData)
      .then((itemRef) => {
        commit('ADD_ITEM', { itemData: { id: itemRef.id, ...itemData }, flat })
        commit('TOGGLE_LOADER', false)
      })
  },
  async updateItem({ state, commit, getters }, itemData) {
    commit('TOGGLE_LOADER', true)
    await db.flats.doc(state.currentFlatId).collection('items').doc(itemData.id).update(itemData)
    commit('UPDATE_ITEM', { itemData, flat: getters.currentFlat })
    commit('TOGGLE_LOADER', false)
  },
  async deleteItem({ state, commit, getters }, itemData) {
    commit('TOGGLE_LOADER', true)
    await db.flats.doc(state.currentFlatId).collection('items').doc(itemData.id).delete()
    commit('DELETE_ITEM', { itemData, flat: getters.currentFlat })
    commit('TOGGLE_LOADER', false)
  },
  async fetchCurrentFlatItems({ state, commit, getters }) {
    const response = await db.flats.doc(state.currentFlatId).collection('items').get()
    const items = response.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    commit('SET_FLAT_ITEMS', { flat: getters.currentFlat, items })
  },
  async initializeStore({ state, commit }) {
    commit('TOGGLE_LOADER', true)

    // Initialize user in flats (s)he have been added to but not initialized yet
    let flatQueryResponse = await db.flats.where('emailsOfUninitializedUsers', 'array-contains', state.user.email).get()

    for (let index = 0; index < flatQueryResponse.docs.length; index++) {
      const flat = flatQueryResponse.docs[index]
      // const flatData =   flat.data()
      const flatDoc = db.flats.doc(flat.id)

      await flatDoc.update({
        uidsOfUsersWithAccess: firebase.firestore.FieldValue.arrayUnion(state.user.id),
        emailsOfUninitializedUsers: firebase.firestore.FieldValue.arrayRemove(state.user.email)
      })

      // Update flatmate document with reference to user document and with name the logged in user chose
      const flatmatesQueryResponse = await flatDoc.collection('flatmates').where('email', '==', state.user.email).get()
      for (let i = 0; i < flatmatesQueryResponse.docs.length; i++) {
        const flatmateRef = flatmatesQueryResponse.docs[i]
        const flatmateDoc = flatDoc.collection('flatmates').doc(flatmateRef.id)

        await flatmateDoc.update({
          name: state.user.name,
          photo: state.user.photo,
          userRef: state.user.id
        })
      }
    }

    const flats = []
    flatQueryResponse = await db.flats.where('uidsOfUsersWithAccess', 'array-contains', state.user.id).get()
    for (let i = 0; i < flatQueryResponse.docs.length; i++) {
      const flat = flatQueryResponse.docs[i]
      const flatData = flat.data()
      // get flatmates details and store it in each flat
      const flatmatesResponse = await db.flats.doc(flat.id).collection('flatmates').get()
      const flatmates = flatmatesResponse.docs.map((flatmateRef) => ({
        id: flatmateRef.id,
        ...flatmateRef.data()
      }))
      flats.push(
        createFlatObject(
          flat.id,
          flatData.name,
          flatData.depreciationRate,
          flatData.lowestPriceRate,
          flatData.emailsOfUninitializedUsers,
          flatmates,
          null
        )
      )
    }
    commit('SET_FLATS', flats)
    commit('TOGGLE_LOADER', false)
  },
  toggleLoader({ commit }, toggle) {
    commit('TOGGLE_LOADER', toggle)
  },
  createFlat({ state, commit }, formFlat) {
    commit('TOGGLE_LOADER', true)
    return new Promise((resolve) => {
      const databaseFlat = {
        name: formFlat.name,
        depreciationRate: formFlat.depreciationRate,
        lowestPriceRate: formFlat.lowestPriceRate,
        emailsOfUninitializedUsers: [],
        uidsOfUsersWithAccess: [state.user.id]
      }
      // Update Firebase with new flat doc
      db.flats.add(databaseFlat).then((flatRef) => {
        // Update Firebase by creating flatmate doc in flat doc
        const initialFlatmateData = {
          userRef: state.user.id,
          name: state.user.name,
          email: state.user.email,
          photo: state.user.photo,
          startDate: formFlat.initialMoveInDate,
          endDate: null
        }
        db.flats
          .doc(flatRef.id)
          .collection('flatmates')
          .add(initialFlatmateData)
          .then((flatmateRef) => {
            const storeFlat = {
              id: flatRef.id,
              name: databaseFlat.name,
              depreciationRate: databaseFlat.depreciationRate,
              lowestPriceRate: databaseFlat.lowestPriceRate,
              flatmates: [
                {
                  id: flatmateRef.id,
                  ...initialFlatmateData
                }
              ],
              emailsOfUninitializedUsers: databaseFlat.emailsOfUninitializedUsers,
              items: []
            }
            commit('CREATE_FLAT', storeFlat)
            commit('TOGGLE_LOADER', false)
            resolve(flatRef.id)
          })
      })
    })
  },
  async updateFlat({ commit, getters }, flatData) {
    commit('TOGGLE_LOADER', true)
    const flat = getters.currentFlat
    await db.flats.doc(flatData.id).update({
      name: flatData.name,
      depreciationRate: flatData.depreciationRate,
      lowestPriceRate: flatData.lowestPriceRate
    })
    commit('UPDATE_FLAT', { flat, flatData })
    commit('TOGGLE_LOADER', false)
  },
  async addFlatmate({ state, commit, getters }, flatmateData) {
    commit('TOGGLE_LOADER', true)
    let newFlatmate = {}
    await db.flats
      .doc(state.currentFlatId)
      .collection('flatmates')
      .add(flatmateData)
      .then((flatmateRef) => {
        newFlatmate = { ...flatmateData, id: flatmateRef.id }
        commit('ADD_FLATMATE', {
          flat: getters.currentFlat,
          flatmateData: newFlatmate
        })
      })
    await db.flats.doc(state.currentFlatId).update({
      emailsOfUninitializedUsers: firebase.firestore.FieldValue.arrayUnion(flatmateData.email)
    })
    commit('TOGGLE_LOADER', false)
    return newFlatmate.id
  },
  async updateFlatmate({ state, commit, getters }, flatmateData) {
    commit('TOGGLE_LOADER', true)
    await db.flats.doc(state.currentFlatId).collection('flatmates').doc(flatmateData.id).update(flatmateData)
    commit('UPDATE_FLATMATE', { flat: getters.currentFlat, flatmateData })
    commit('TOGGLE_LOADER', false)
  },
  async removeFlatmate({ state, commit, getters }, { flatmate, moveOutDate }) {
    commit('TOGGLE_LOADER', true)
    const flatDoc = db.flats.doc(state.currentFlatId)
    await flatDoc.collection('flatmates').doc(flatmate.id).update({ endDate: moveOutDate })

    // Remove access
    const updatedField = {}
    if (flatmate.userRef) {
      updatedField.uidsOfUsersWithAccess = firebase.firestore.FieldValue.arrayRemove(flatmate.userRef)
    } else {
      updatedField.emailsOfUninitializedUsers = firebase.firestore.FieldValue.arrayRemove(flatmate.email)
    }
    await flatDoc.update(updatedField)

    commit('SET_FLATMATE_MOVE_OUT_DATE', {
      flat: getters.currentFlat,
      flatmateId: flatmate.id,
      moveOutDate
    })
    commit('TOGGLE_LOADER', false)
  },
  async updateFlatmateItems({ state, commit, getters }, { flatmate, itemIdsToBeRemovedFrom, itemIdsToBeAddedAt }) {
    commit('TOGGLE_LOADER', true)
    const batch = firestore.batch()
    const itemsCollection = db.flats.doc(state.currentFlatId).collection('items')
    // TODO: This only works for 500 records: https://firebase.google.com/docs/firestore/manage-data/transactions
    itemIdsToBeRemovedFrom.forEach((itemId) => {
      const itemRef = itemsCollection.doc(itemId)
      batch.update(itemRef, {
        idsOfFlatmatesThatShareThis: firebase.firestore.FieldValue.arrayRemove(flatmate.id)
      })
    })
    itemIdsToBeAddedAt.forEach((itemId) => {
      const itemRef = itemsCollection.doc(itemId)
      batch.update(itemRef, {
        idsOfFlatmatesThatShareThis: firebase.firestore.FieldValue.arrayUnion(flatmate.id)
      })
    })

    batch.commit().then(function () {
      commit('UPDATE_FLAT_ITEMS_SHARING_INFO', {
        flat: getters.currentFlat,
        flatmateId: flatmate.id,
        itemIdsToBeRemovedFrom,
        itemIdsToBeAddedAt
      })
      commit('TOGGLE_LOADER', false)
    })
  }
}
