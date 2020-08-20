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
    component: () => import(/* webpackChunkName: "addFlat" */ '../views/FlatAdd.vue')
  },
  {
    path: '/flat/:flatId',
    name: 'Flat',
    props: route => ({ ...route.params, getFlat: getFlat, getFlatItems: getFlatItems }),
    component: () => import(/* webpackChunkName: "flat" */ '../views/Flat.vue')
  },
  {
    path: '/flat/:flatId/edit',
    name: 'Edit Flat',
    props: route => ({ ...route.params, getFlat: getFlat }),
    component: () => import(/* webpackChunkName: "editFlat" */ '../views/FlatEdit.vue')
  },
  {
    path: '/flat/:flatId/item/:itemId',
    name: 'Item',
    props: route => ({ ...route.params, getFlat: getFlat, getFlatItems: getFlatItems }),
    component: () => import(/* webpackChunkName: "item" */ '../views/Item.vue')
  },
  {
    path: '/flat/:flatId/item/:itemId/edit',
    name: 'Edit Item',
    props: route => ({ ...route.params, getFlat: getFlat, getFlatItems: getFlatItems }),
    component: () => import(/* webpackChunkName: "editItem" */ '../views/ItemEdit.vue')
  },
  {
    path: '/flat/:flatId/items/add',
    name: 'Add Item',
    props: route => ({ ...route.params, getFlat: getFlat, getFlatItems: getFlatItems }),
    component: () => import(/* webpackChunkName: "addItem" */ '../views/ItemAdd.vue')
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
          id: user.uid,
          name: user.displayName,
          email: user.email,
          photo: user.photoURL
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

function getFlat (flatId) {
  let flat = {}
  if (!store.selectedFlat) {
    flat = store.getters.flatById(flatId)
    store.dispatch('selectFlat', flat)
  } else {
    flat = store.selectedFlat
  }
  return flat
}

function getFlatItems (flatId) {
  return new Promise((resolve) => {
    const flat = getFlat(flatId)
    store.dispatch('fetchFlatItems', flat).then(() => {
      resolve()
    })
  })
}

export default router
