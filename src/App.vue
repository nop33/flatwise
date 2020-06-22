<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-toolbar-title>
        <router-link
          to="/"
          class="white--text text-decoration-none"
        >
          Flatwise
        </router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn
        icon
        to="/settings"
      >
        <v-icon>mdi-cog</v-icon>
      </v-btn>

    </v-app-bar>

    <v-main>
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
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapState(['loading'])
  },
  created () {
    let items = []
    let settings = {}
    const itemsPromise = this.$db.items.get().then(response => {
      items = response.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }))
    })
    const settingsPromise = this.$db.settings.get().then(response => {
      settings = response.docs[0].data()
      settings.id = response.docs[0].id
    })
    const promises = [
      itemsPromise,
      settingsPromise
    ]

    Promise.all(promises).then(() => {
      this.$store.dispatch('initializeStore', { items, settings }).then(() => {
        this.$store.dispatch('toggleLoader', false)
      })
    })
  }
}
</script>
