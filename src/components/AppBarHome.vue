<template>
  <div>
    <v-navigation-drawer v-model="isNavigationDrawerOpen" temporary app>
      <v-list nav>
        <v-list-item v-if="user">
          <v-list-item-avatar>
            <v-img :src="user.photoURL" referrerpolicy="no-referrer" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="title">{{ user.displayName }}</v-list-item-title>
            <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list class="pa-0">
        <v-divider/>
        <v-list-item-group>
          <v-list-item v-if="user" @click="logUserOut">
            <v-list-item-icon>
              <v-icon>mdi-logout-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click.stop="isNavigationDrawerOpen = !isNavigationDrawerOpen" />
      <v-toolbar-title>
        <router-link to="/" class="white--text text-decoration-none">Flatwise</router-link>
      </v-toolbar-title>

      <!-- <v-btn icon to="/createFlat" v-if="user">
        <v-icon>mdi-plus</v-icon>
      </v-btn>

      <v-btn icon to="/settings" v-if="user">
        <v-icon>mdi-cog</v-icon>
      </v-btn>

      <v-btn icon @click="logUserOut" v-if="user">
        <v-icon>mdi-logout-variant</v-icon>
      </v-btn> -->

    </v-app-bar>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  data: () => {
    return {
      isNavigationDrawerOpen: false
    }
  },
  computed: {
    ...mapState([
      'user'
    ])
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
