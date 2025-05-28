import Vue from 'vue'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import firestore from './firebase.js'
import { createUserObject } from './store/models.js'
import './utils/filters'

Vue.config.productionTip = false

Vue.prototype.$db = {
  users: firestore.collection('users')
}

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        if (!store.state.user) {
          const storeUser = createUserObject(user.uid, user.displayName, user.email, user.photoURL)
          store.commit('SET_USER', storeUser)
        }
        store.dispatch('initializeStore')
      }
    })
  }
}).$mount('#app')
