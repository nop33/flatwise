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
    path: '/register',
    name: 'Register',
    component: () => import(/* webpackChunkName: "register" */ '../views/Register.vue')
  },
  {
    path: '/flats/add',
    name: 'Add Flat',
    component: () => import(/* webpackChunkName: "createFlat" */ '../views/FlatAdd.vue')
  },
  {
    path: '/flat/:flatId',
    name: 'Flat',
    props: true,
    component: () => import(/* webpackChunkName: "add" */ '../views/Flat.vue')
  },
  {
    path: '/flat/:flatId/add',
    name: 'Add Item',
    props: true,
    component: () => import(/* webpackChunkName: "add" */ '../views/ItemAdd.vue')
  },
  {
    path: '/edit/:id',
    name: 'Edit Item',
    props: true,
    component: () => import(/* webpackChunkName: "edit" */ '../views/ItemEdit.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import(/* webpackChunkName: "settings" */ '../views/Settings.vue')
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
  // router.beforeEach((to, from, next) => {
  //   if (to.name !== 'login' && !isAuthenticated) {
  //     next({ name: 'login' });
  //   } else {
  //     next();
  //   }
  // });
})

export default router
