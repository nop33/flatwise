import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueFirestore from 'vue-firestore'
import firebase from 'firebase/app'
import 'firebase/firestore'

Vue.config.productionTip = false

require('dotenv').config()

require('firebase/firestore')

Vue.use(VueFirestore)

const firebaseApp = firebase.initializeApp({
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID
})

const firestore = firebaseApp.firestore()

Vue.prototype.$db = {
  items: firestore.collection('items'),
  settings: firestore.collection('settings'),
  users: firestore.collection('users')
}

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
