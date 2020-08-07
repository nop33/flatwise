import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import store from '../store/index.js'
import firebase from 'firebase/app'
import 'firebase/auth'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/flat/:flatId/add',
    name: 'AddItem',
    props: true,
    component: () => import(/* webpackChunkName: "add" */ '../views/ItemForm.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "register" */ '../views/Register.vue')
  },
  {
    path: '/edit/:id',
    name: 'EditItem',
    props: true,
    component: () => import(/* webpackChunkName: "edit" */ '../views/ItemForm.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import(/* webpackChunkName: "settings" */ '../views/Settings.vue')
  },
  {
    path: '/createFlat',
    name: 'Create Flat',
    component: () => import(/* webpackChunkName: "createFlat" */ '../views/CreateFlat.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      if (!store.state.user) {
        store.dispatch('setUser', {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          id: user.uid
        })
      }
    } else if (to.name !== 'Login') {
      store.dispatch('setUser', null)
      next({ name: 'Login' })
    }
    next()
  })
})

export default router
