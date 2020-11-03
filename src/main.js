import Vue from 'vue'
import VueFirestore from 'vue-firestore'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import firestore from './firebase.js'
import { createUserObject } from './store/models.js'

Vue.config.productionTip = false

Vue.use(VueFirestore)

Vue.prototype.$db = {
  users: firestore.collection('users')
}

Vue.filter('round', function (value) {
  if (value !== 0 && !value) return ''
  value = parseFloat(value)
  return Math.floor(value * 100) / 100
})

Vue.filter('humanReadable', function (value) {
  if (!value) return ''
  const date = new Date(value)
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Intl.DateTimeFormat('en-GB', options).format(date)
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  created () {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        if (!store.state.user) {
          const storeUser = createUserObject(
            user.uid,
            user.displayName,
            user.email,
            user.photoURL
          )
          store.dispatch('setUser', storeUser)
        }
        store.dispatch('initializeStore')
      }
    })
  }
}).$mount('#app')
