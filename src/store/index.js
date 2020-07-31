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
    items: [] // will be filled from firestore
  },
  getters: {
    itemById: state => itemId => state.items.find(item => item.id === itemId)
  },
  mutations: {
    SET_USER (state, user) {
      state.user = user
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
