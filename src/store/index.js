import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    loading: true,
    depreciationRate: 0,
    lowestPriceRate: 0,
    flatmates: [],
    settingsId: '',
    moveOutDate: new Date().toISOString().substr(0, 10),
    flatmateMovingOut: '',
    items: [], // will be filled from firestore
    flats: []
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
      item.depreciationRate = itemData.depreciationRate
      item.lowestPriceRate = itemData.lowestPriceRate
    },
    DELETE_ITEM (state, itemData) {
      state.items.splice(state.items.indexOf(state.items.find(item => item.id === itemData.id)), 1)
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
    SET_FLATS (state, flats) {
      state.flats = flats
    }
  },
  actions: {
    setUser ({ commit }, user) {
      commit('SET_USER', user)
    },
    registerUser ({ commit }, user) {
      Vue.prototype.$db.users.doc(user.id).set(user).then(() => {
        commit('SET_USER', user)
      })
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
    async initializeStore ({ state, commit }, userId) {
      const response = await Vue.prototype.$db.flats.where('flatmatesUids', 'array-contains', userId).get()
      const flats = response.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      commit('SET_FLATS', flats)
    },
    toggleLoader ({ commit }, toggle) {
      commit('TOGGLE_LOADER', toggle)
    },
    createFlat ({ commit }, flatData) {
      flatData.items = []
      Vue.prototype.$db.flats.add(flatData).then((docRef) => {
        commit('CREATE_FLAT', { id: docRef.id, ...flatData })
      })
    }
  },
  modules: {
  }
})
