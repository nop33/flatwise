import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    loading: true,
    depreciationRate: 20,
    lowestPriceRate: 20,
    flatmates: [],
    settingsId: '',
    moveOutDate: new Date().toISOString().substr(0, 10),
    flatmateMovingOut: '',
    items: [] // will be filled from firestore
  },
  getters: {
    itemById: state => itemId => state.items.find(item => item.id === itemId)
  },
  mutations: {
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
    ADD_ITEM (state, itemToAdd) {
      state.items.push(itemToAdd)
    },
    UPDATE_ITEM (state, itemData) {
      const item = state.items.find(item => item.id === itemData.id)
      item.name = itemData.name
      item.price = itemData.price
      item.date = itemData.date
      item.shareAmongst = itemData.shareAmongst
    },
    DELETE_ITEM (state, itemData) {
      state.items.splice(state.items.indexOf(state.items.find(item => item.id === itemData.id)), 1)
    },
    UPDATE_SETTINGS (state, settingsData) {
      state.depreciationRate = settingsData.depreciationRate
      state.lowestPriceRate = settingsData.lowestPriceRate
      state.flatmates = settingsData.flatmates
    },
    INITIALIZE_STORE (state, { items, settings }) {
      state.items = items
      state.depreciationRate = settings.depreciationRate
      state.lowestPriceRate = settings.lowestPriceRate
      state.flatmates = settings.flatmates
      state.settingsId = settings.id
    },
    TOGGLE_LOADER (state, toggle) {
      state.loading = toggle
    }
  },
  actions: {
    setUser ({ commit }, user) {
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
    addItem ({ commit }, itemData) {
      commit('TOGGLE_LOADER', true)
      const id = Date.now().toString()
      Vue.prototype.$db.items.doc(`${id}`).set(itemData).then(() => {
        itemData.id = id
        commit('ADD_ITEM', itemData)
        commit('TOGGLE_LOADER', false)
      })
    },
    updateItem ({ commit }, itemData) {
      commit('TOGGLE_LOADER', true)
      const { id, ...data } = itemData
      Vue.prototype.$db.items.doc(id).set(data).then(() => {
        commit('UPDATE_ITEM', itemData)
        commit('TOGGLE_LOADER', false)
      })
    },
    deleteItem ({ commit }, itemData) {
      commit('TOGGLE_LOADER', true)
      Vue.prototype.$db.items.doc(itemData.id).delete().then(() => {
        commit('DELETE_ITEM', itemData)
        commit('TOGGLE_LOADER', false)
      })
    },
    updateSettings ({ state, commit }, settingsData) {
      commit('TOGGLE_LOADER', true)
      Vue.prototype.$db.settings.doc(state.settingsId).set(settingsData).then(() => {
        commit('UPDATE_SETTINGS', settingsData)
        commit('TOGGLE_LOADER', false)
      })
    },
    initializeStore ({ commit }) {
      let items = []
      let settings = {}
      const itemsPromise = Vue.prototype.$db.items.get().then(response => {
        items = response.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }))
      })
      const settingsPromise = Vue.prototype.$db.settings.get().then(response => {
        settings = response.docs[0].data()
        settings.id = response.docs[0].id
      })
      const promises = [
        itemsPromise,
        settingsPromise
      ]

      Promise.all(promises).then(() => {
        commit('INITIALIZE_STORE', { items, settings })
      })
    },
    toggleLoader ({ commit }, toggle) {
      commit('TOGGLE_LOADER', toggle)
    }
  },
  modules: {
  }
})
