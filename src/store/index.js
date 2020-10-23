import Vue from 'vue'
import Vuex from 'vuex'

import { createFlatObject } from './models.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    loading: false,
    moveOutDate: new Date().toISOString().substr(0, 10),
    flatmateMovingOut: '',
    flats: [],
    selectedFlat: null
  },
  getters: {
    flatById: state => flatId => state.flats.find(flat => flat.id === flatId),
    flatItemById: state => (flatId, itemId) => {
      const flat = state.flats.find(flat => flat.id === flatId)
      if (flat.items && flat.items.length >= 0) {
        return flat.items.find(item => item.id === itemId)
      }
      return null
    }
  },
  mutations: {
    SET_SELECTED_FLAT (state, flat) {
      state.selectedFlat = flat
    },
    SET_USER (state, user) {
      state.user = user
    },
    SET_FLATMATE_MOVING_OUT (state, flatmate) {
      state.flatmateMovingOut = flatmate
    },
    SET_MOVE_OUT_DATE (state, date) {
      state.moveOutDate = date
    },
    ADD_ITEM (state, { itemData, selectedFlat }) {
      selectedFlat.items.push(itemData)
    },
    UPDATE_ITEM (state, itemData) {
      const item = state.selectedFlat.items.find(item => item.id === itemData.id)
      item.name = itemData.name
      item.price = itemData.price
      item.date = itemData.date
      item.idsOfFlatmatesThatShareThis = itemData.idsOfFlatmatesThatShareThis
      item.depreciationRate = itemData.depreciationRate
      item.lowestPriceRate = itemData.lowestPriceRate
    },
    DELETE_ITEM (state, itemData) {
      const items = state.selectedFlat.items
      items.splice(items.indexOf(items.find(item => item.id === itemData.id)), 1)
    },
    TOGGLE_LOADER (state, toggle) {
      state.loading = toggle
    },
    CREATE_FLAT (state, flatData) {
      state.flats.push(flatData)
    },
    UPDATE_FLAT (state, flatData) {
      const flat = state.flats.find(flat => flat.id === flatData.id)
      flat.name = flatData.name
      flat.depreciationRate = flatData.depreciationRate
      flat.lowestPriceRate = flatData.lowestPriceRate
      flat.flatmatesNames = flatData.flatmatesNames
    },
    SET_FLATS (state, flats) {
      state.flats = flats
      state.isStoreInitialized = true
    },
    SET_FLAT_ITEMS (state, { flat, items }) {
      flat.items = items
    }
  },
  actions: {
    selectFlat ({ commit }, flat) {
      commit('SET_SELECTED_FLAT', flat)
    },
    setUser ({ commit }, user) {
      commit('SET_USER', user)
    },
    async registerUser ({ commit }, user) {
      await Vue.prototype.$db.users.doc(user.id).set(user)
      commit('SET_USER', user)
    },
    setFlatmateMovingOut ({ commit }, flatmate) {
      commit('SET_FLATMATE_MOVING_OUT', flatmate)
    },
    setMoveOutDate ({ commit }, date) {
      commit('SET_MOVE_OUT_DATE', date)
    },
    async addItem ({ state, commit }, itemData) {
      const selectedFlat = state.selectedFlat
      await Vue.prototype.$db.flats.doc(state.selectedFlat.id).collection('items').add(itemData).then(itemRef => {
        commit('ADD_ITEM', { itemData: { id: itemRef.id, ...itemData }, selectedFlat })
      })
    },
    async updateItem ({ state, commit }, itemData) {
      const selectedFlat = state.selectedFlat
      await Vue.prototype.$db.flats.doc(selectedFlat.id).collection('items').doc(itemData.id).update(itemData)
      commit('UPDATE_ITEM', itemData)
    },
    async deleteItem ({ state, commit }, itemData) {
      const selectedFlat = state.selectedFlat
      await Vue.prototype.$db.flats.doc(selectedFlat.id).collection('items').doc(itemData.id).delete()
      commit('DELETE_ITEM', itemData)
    },
    async fetchFlatItems ({ commit }, flat) {
      const response = await Vue.prototype.$db.flats.doc(flat.id).collection('items').get()
      const items = response.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      commit('SET_FLAT_ITEMS', { flat, items })
    },
    async initializeStore ({ state, commit }) {
      commit('TOGGLE_LOADER', true)

      // Initialize user in flats (s)he have been added to but not initialized yet
      // let response = await Vue.prototype.$db.flats.where('emailsOfUninitializedUsers', 'array-contains', state.user.email).get()
      // for (let index = 0; index < response.docs.length; index++) {
      //   const flat = response.docs[index]
      //   const flatData = flat.data()
      //   const flatDoc = Vue.prototype.$db.flats.doc(flat.id)

      //   flatData.emailsOfUninitializedUsers.splice(flatData.emailsOfUninitializedUsers.indexOf(state.user.email), 1)
      //   await flatDoc.update({
      //     // Add current user to flatmates
      //     // flatmates: [state.user, ...flatData.flatmates],
      //     // remove his/her email from uninitialized users
      //     emailsOfUninitializedUsers: flatData.emailsOfUninitializedUsers,
      //     // give him/her access to flat
      //     uidsOfUsersWithAccess: [state.user.id, ...flatData.uidsOfUsersWithAccess]
      //   })

      //   // Update flatmate document with reference to user document
      //   const flatmatesResponse = await flatDoc.collection('flatmates').where('email', '==', state.user.email).get()
      //   for (let i = 0; i < flatmatesResponse.docs.length; i++) {
      //     const flatmate = flatmatesResponse.docs[i]
      //     const flatmateDoc = flatDoc.collection('flatmates').doc(flatmate.id)

      //     await flatmateDoc.update({
      //       userRef: state.user.id
      //     })
      //   }

      //   // TODO: Clean this up
      //   // Update all items
      //   // const flatItemsCollection = Vue.prototype.$db.flats.doc(flat.id).collection('items')
      //   // const itemsResponse = await flatItemsCollection.where('idsOfFlatmatesThatShareThis', 'array-contains', state.user.email).get()
      //   // for (let index = 0; index < itemsResponse.docs.length; index++) {
      //   //   const item = itemsResponse.docs[index]
      //   //   const itemData = item.data()
      //   //   itemData.idsOfFlatmatesThatShareThis.splice(itemData.idsOfFlatmatesThatShareThis.indexOf(state.user.email), 1, state.user.id)
      //   //   await flatItemsCollection.doc(item.id).update({
      //   //     idsOfFlatmatesThatShareThis: itemData.idsOfFlatmatesThatShareThis
      //   //   })
      //   // }
      // }

      const flats = []
      const response = await Vue.prototype.$db.flats.where('uidsOfUsersWithAccess', 'array-contains', state.user.id).get()
      for (let i = 0; i < response.docs.length; i++) {
        const flat = response.docs[i]
        const flatData = flat.data()
        // get flatmates details and store it in each flat
        const flatmatesResponse = await Vue.prototype.$db.flats.doc(flat.id).collection('flatmates').get()
        const flatmates = flatmatesResponse.docs.map(flatmateRef => ({ id: flatmateRef.id, ...flatmateRef.data() }))
        flats.push(createFlatObject(
          flat.id,
          flatData.name,
          flatData.depreciationRate,
          flatData.lowestPriceRate,
          flatData.emailsOfUninitializedUsers,
          flatmates,
          null
        ))
      }
      commit('SET_FLATS', flats)
      commit('TOGGLE_LOADER', false)
    },
    toggleLoader ({ commit }, toggle) {
      commit('TOGGLE_LOADER', toggle)
    },
    createFlat ({ state, commit }, formFlat) {
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
        Vue.prototype.$db.flats.add(databaseFlat).then((flatRef) => {
          // Update Firebase by creating flatmate doc in flat doc
          const initialFlatmateData = {
            userRef: state.user.id,
            name: state.user.name,
            email: state.user.email,
            photo: state.user.photo,
            startDate: formFlat.initialMoveInDate,
            endDate: null
          }
          Vue.prototype.$db.flats.doc(flatRef.id).collection('flatmates').add(initialFlatmateData).then((flatmateRef) => {
            const storeFlat = {
              id: flatRef.id,
              name: databaseFlat.name,
              depreciationRate: databaseFlat.depreciationRate,
              lowestPriceRate: databaseFlat.lowestPriceRate,
              flatmates: [{
                id: flatmateRef.id,
                ...initialFlatmateData
              }],
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
    async updateFlat ({ commit }, flatData) {
      commit('TOGGLE_LOADER', true)
      await Vue.prototype.$db.flats.doc(flatData.id).update({
        name: flatData.name,
        depreciationRate: flatData.depreciationRate,
        lowestPriceRate: flatData.lowestPriceRate
      })
      commit('UPDATE_FLAT', flatData)
      commit('TOGGLE_LOADER', false)
    }
  },
  modules: {
  }
})
