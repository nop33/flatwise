<template>
  <v-app>
    <router-view v-if="isStoreInitialized"></router-view>
    <Loader v-else />
  </v-app>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'
import { mapState } from 'vuex'

import Loader from '@/views/Loader.vue'

export default {
  components: {
    Loader
  },
  computed: {
    ...mapState([
      'user',
      'isStoreInitialized'
    ])
  },
  created () {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.dispatch('initializeStore', user.uid)
      }
    })
  }
}
</script>
