import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    depreciationRate: 20,
    lowestPriceRate: 20,
    items: [
      {
        id: 1,
        name: 'Sofa',
        price: 1250,
        date: '2019-08-01'
      },
      {
        id: 2,
        name: 'Balcony rug',
        price: 70,
        date: '2020-06-01'
      }
    ]
  },
  getters: {
    itemById: state => itemId => state.items.find(item => item.id === itemId)
  },
  mutations: {
    ADD_ITEM (state, item) {
      state.items.push(item)
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
    }
  },
  actions: {
    addItem ({ commit }, itemData) {
      itemData.id = Date.now()
      commit('ADD_ITEM', itemData)
    },
    updateItem ({ commit }, itemData) {
      commit('UPDATE_ITEM', itemData)
    },
    deleteItem ({ commit }, itemData) {
      commit('DELETE_ITEM', itemData)
    },
    updateSettings ({ commit }, settingsData) {
      commit('UPDATE_SETTINGS', settingsData)
    }
  },
  modules: {
  }
})
