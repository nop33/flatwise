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

router.beforeEach((to, from, next) => {
  if (to.params.flatId) {
    store.commit('SET_CURRENT_FLAT_ID', to.params.flatId)
  }
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // TODO: Clean this up
      // if (!store.state.user) {
      //   store.commit('SET_USER', {
      //     id: user.uid,
      //     name: user.displayName,
      //     email: user.email,
      //     photo: user.photoURL
      //   })
      // }
    } else if (to.name !== 'Login') {
      store.commit('SET_USER', null)
      next({ name: 'Login' })
    }
    next()
  })
  // TODO: Clean this up
  // router.beforeEach((to, from, next) => {
  //   if (to.name !== 'login' && !isAuthenticated) {
  //     next({ name: 'login' });
  //   } else {
  //     next();
  //   }
  // });
})

export default router
