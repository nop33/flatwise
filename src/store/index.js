import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
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
    UPDATE_ITEM (state, itemToUpdate) {
      // update on firebase
    },
    DELETE_ITEM (state, itemToDelete) {
      state.items.splice(state.items.indexOf(state.items.find(item => item.id === itemToDelete.id)), 1)
    }
  },
  actions: {
    addItem ({ commit }, item) {
      item.id = Date.now()
      commit('ADD_ITEM', item)
    },
    updateItem ({ commit }, item) {
      commit('UPDATE_ITEM', item)
    },
    deleteItem ({ commit }, item) {
      commit('DELETE_ITEM', item)
    }
  },
  modules: {
  }
})
