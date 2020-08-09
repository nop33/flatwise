<template>
  <v-app>
    <router-view></router-view>
    <!-- <v-main>
        <router-view v-if="!loading"></router-view>
        <v-container fill-height fluid v-else>
          <v-row
            align="center"
            justify="center"
          >
            <v-col>
              <v-progress-circular
                :size="50"
                color="primary"
                indeterminate
                align="center"
              ></v-progress-circular>
            </v-col>
          </v-row>
        </v-container>
    </v-main> -->
  </v-app>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState([
      'user'
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
