import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from 'firebase/app'
import 'firebase/auth'

import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import store from '../store/index.js'

import flatRoutes from './flat.js'
import itemRoutes from './item.js'
import flatmateRoutes from './flatmate.js'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  ...flatRoutes,
  ...itemRoutes,
  ...flatmateRoutes
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

function isUserAuthenticated () {
  return new Promise((resolve, reject) => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      console.log('calling onAuthStateChanged in isUserAuthenticated (routes)')
      unsubscribe()
      resolve(!!user)
    }, reject)
  })
}

router.beforeEach(async (to, from, next) => {
  console.log('entering guard...')

  if (to.name !== 'Login' && !await isUserAuthenticated()) {
    store.commit('SET_USER', null)
    console.log('calling next(Login)')
    next({ name: 'Login' })
  } else {
    if (to.params.flatId) {
      store.commit('SET_CURRENT_FLAT_ID', to.params.flatId)
    }
    console.log('calling next()')
    next()
  }

  console.log('exiting guard...')
})

export default router
