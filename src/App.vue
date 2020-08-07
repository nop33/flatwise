<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>
        <router-link to="/" class="white--text text-decoration-none">Flatwise</router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon to="/createFlat" v-if="user">
        <v-icon>mdi-plus</v-icon>
      </v-btn>

      <v-btn icon to="/settings" v-if="user">
        <v-icon>mdi-cog</v-icon>
      </v-btn>

      <v-btn icon @click="logUserOut" v-if="user">
        <v-icon>mdi-logout-variant</v-icon>
      </v-btn>

    </v-app-bar>

    <v-main>
        <router-view></router-view>
        <!-- <router-view v-if="!loading"></router-view>
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
        </v-container> -->
    </v-main>
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
  },
  methods: {
    logUserOut () {
      firebase.auth().signOut().then(function () {
        console.log('Signed Out')
      }, function (error) {
        console.error('Sign Out Error', error)
      })
    }
  }
}
</script>
