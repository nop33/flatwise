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
  mutations: {
    ADD_ITEM (state, item) {
      state.items.push(item)
    },
    REMOVE_ITEM (state, itemToDelete) {
      state.items.find(item => {
        return item.id === itemToDelete.id
      })
    }
  },
  actions: {
    addItem ({ state, commit }, item) {
      commit('ADD_ITEM', item)
    },
    removeItem ({ commit }, item) {
      commit('REMOVE_ITEM', item)
    }
  },
  modules: {
  }
})
