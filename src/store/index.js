import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: true,
    depreciationRate: 20,
    lowestPriceRate: 20,
    items: []
  },
  getters: {
    itemById: state => itemId => state.items.find(item => item.id === itemId)
  },
  mutations: {
    ADD_ITEM (state, itemToAdd) {
      state.items.push(itemToAdd)
    },
    UPDATE_ITEM (state, itemData) {
      const item = state.items.find(item => item.id === itemData.id)
      item.name = itemData.name
      item.price = itemData.price
      item.date = itemData.date
      // update on firebase
    },
    DELETE_ITEM (state, itemData) {
      state.items.splice(state.items.indexOf(state.items.find(item => item.id === itemData.id)), 1)
    },
    UPDATE_SETTINGS (state, settingsData) {
      state.depreciationRate = settingsData.depreciationRate
      state.lowestPriceRate = settingsData.lowestPriceRate
    },
    INITIALIZE_STORE (state, items) {
      state.items = items
    },
    TOGGLE_LOADER (state, toggle) {
      state.loading = toggle
    }
  },
  actions: {
    addItem ({ commit }, itemData) {
      commit('TOGGLE_LOADER', true)
      const id = Date.now()
      Vue.prototype.$db.items.doc(`${id}`).set(itemData).then(() => {
        itemData.id = id
        commit('ADD_ITEM', itemData)
        commit('TOGGLE_LOADER', false)
      })
    },
    updateItem ({ commit }, itemData) {
      commit('UPDATE_ITEM', itemData)
    },
    deleteItem ({ commit }, itemData) {
      commit('DELETE_ITEM', itemData)
    },
    updateSettings ({ commit }, settingsData) {
      commit('UPDATE_SETTINGS', settingsData)
    },
    initializeStore ({ commit }, items) {
      commit('INITIALIZE_STORE', items)
    },
    toggleLoader ({ commit }, toggle) {
      commit('TOGGLE_LOADER', toggle)
    }
  },
  modules: {
  }
})
