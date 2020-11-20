import Vue from 'vue'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import firestore from './firebase.js'
import { createUserObject } from './store/models.js'
import './filters'

Vue.config.productionTip = false

Vue.prototype.$db = {
  users: firestore.collection('users')
}

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  created () {
    firebase.auth().onAuthStateChanged(user => {
      console.log('calling onAuthStateChanged in main.js')
      if (user) {
        const currentUserId = firebase.auth().currentUser.uid
        this.$db.users.doc(currentUserId).get().then(doc => {
          if (!doc.exists) {
            const newUser = createUserObject(user.uid, user.displayName, user.email, user.photoURL)
            this.$store.dispatch('registerUser', newUser).then(() => {
              console.log('initializeStore after registering user')
              store.dispatch('initializeStore')
            })
          } else {
            if (!store.state.user) {
              const storeUser = createUserObject(user.uid, user.displayName, user.email, user.photoURL)
              store.commit('SET_USER', storeUser)
            }
            console.log('initializeStore after just setting user in state')
            store.dispatch('initializeStore')
          }
        })
      }
    })
  }
}).$mount('#app')
