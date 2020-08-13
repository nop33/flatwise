import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    loading: false,
    depreciationRate: 0,
    lowestPriceRate: 0,
    flatmates: [],
    settingsId: '',
    moveOutDate: new Date().toISOString().substr(0, 10),
    flatmateMovingOut: '',
    items: [], // will be filled from firestore
    flats: [],
    selectedFlat: null
  },
  getters: {
    itemById: state => itemId => state.items.find(item => item.id === itemId),
    flatById: state => flatId => state.flats.find(flat => flat.id === flatId),
    flatItemById: state => (flatId, itemId) => state.flats.find(flat => flat.id === flatId).items.find(item => item.id === itemId)
  },
  mutations: {
    SET_SELECTED_FLAT (state, flat) {
      state.selectedFlat = flat
    },
    SET_USER (state, user) {
      state.user = user
    },
    SET_DEPRECIATION_RATE (state, rate) {
      state.depreciationRate = rate
    },
    SET_LOWEST_PRICE_RATE (state, rate) {
      state.lowestPriceRate = rate
    },
    SET_FLATMATES (state, flatmates) {
      state.flatmates = flatmates
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
      item.shareAmongst = itemData.shareAmongst
      item.depreciationRate = itemData.depreciationRate
      item.lowestPriceRate = itemData.lowestPriceRate
    },
    DELETE_ITEM (state, itemData) {
      const items = state.selectedFlat.items
      items.splice(items.indexOf(items.find(item => item.id === itemData.id)), 1)
    },
    UPDATE_SETTINGS (state, settingsData) {
      state.depreciationRate = settingsData.depreciationRate
      state.lowestPriceRate = settingsData.lowestPriceRate
      state.flatmates = settingsData.flatmates
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
    setDepreciationRate ({ commit }, rate) {
      commit('SET_DEPRECIATION_RATE', rate)
    },
    setLowestPriceRate ({ commit }, rate) {
      commit('SET_LOWEST_PRICE_RATE', rate)
    },
    setFlatmates ({ commit }, flatmates) {
      commit('SET_FLATMATES', flatmates)
    },
    setFlatmateMovingOut ({ commit }, flatmate) {
      commit('SET_FLATMATE_MOVING_OUT', flatmate)
    },
    setMoveOutDate ({ commit }, date) {
      commit('SET_MOVE_OUT_DATE', date)
    },
    addItem ({ state, commit }, itemData) {
      const id = Date.now().toString()
      const selectedFlat = state.selectedFlat
      Vue.prototype.$db.flats.doc(selectedFlat.id).collection('items').doc(id).set(itemData).then(() => {
        itemData.id = id
        commit('ADD_ITEM', { itemData, selectedFlat })
      })
    },
    updateItem ({ state, commit }, itemData) {
      const selectedFlat = state.selectedFlat
      Vue.prototype.$db.flats.doc(selectedFlat.id).collection('items').doc(itemData.id).update(itemData).then(() => {
        commit('UPDATE_ITEM', itemData)
      })
    },
    deleteItem ({ state, commit }, itemData) {
      const selectedFlat = state.selectedFlat
      Vue.prototype.$db.flats.doc(selectedFlat.id).collection('items').doc(itemData.id).delete().then(() => {
        commit('DELETE_ITEM', itemData)
      })
    },
    updateSettings ({ state, commit }, settingsData) {
      Vue.prototype.$db.settings.doc(state.settingsId).set(settingsData).then(() => {
        commit('UPDATE_SETTINGS', settingsData)
      })
    },
    async fetchFlatItems ({ commit }, flat) {
      const items = []
      const results = await Vue.prototype.$db.flats.doc(flat.id).collection('items').get()
      results.forEach(doc => {
        items.push({
          id: doc.id,
          ...doc.data()
        })
      })
      commit('SET_FLAT_ITEMS', { flat, items })
    },
    async initializeStore ({ commit }, user) {
      commit('TOGGLE_LOADER', true)
      const response = await Vue.prototype.$db.flats.where('flatmatesEmails', 'array-contains', user.email).get()
      const flats = response.docs.map(flat => {
        const flatData = flat.data()
        if (flatData.flatmatesNames.includes(user.email)) {
          flatData.flatmatesNames.splice(flatData.flatmatesNames.indexOf(user.email), 1, user.displayName)
          Vue.prototype.$db.flats.doc(flat.id).update({ flatmatesNames: flatData.flatmatesNames })
        }

        const returnValue = {
          id: flat.id,
          ...flat.data()
        }
        returnValue.flatmatesNames = flatData.flatmatesNames
        return returnValue
      })
      commit('SET_FLATS', flats)
      commit('TOGGLE_LOADER', false)
    },
    toggleLoader ({ commit }, toggle) {
      commit('TOGGLE_LOADER', toggle)
    },
    createFlat ({ state, commit }, flatData) {
      return new Promise((resolve) => {
        flatData.items = []
        flatData.flatmatesNames = [
          state.user.displayName,
          ...flatData.flatmatesEmails.filter(email => email !== state.user.email)
        ]
        Vue.prototype.$db.flats.add(flatData).then((docRef) => {
          const flat = { id: docRef.id, ...flatData }
          commit('CREATE_FLAT', flat)
          resolve(docRef.id)
        })
      })
    },
    updateFlat ({ commit }, flatData) {
      Vue.prototype.$db.flats.doc(flatData.id).update({
        name: flatData.name,
        depreciationRate: flatData.depreciationRate,
        lowestPriceRate: flatData.lowestPriceRate
      }).then(() => {
        commit('UPDATE_FLAT', flatData)
      })
    }
  },
  modules: {
  }
})
