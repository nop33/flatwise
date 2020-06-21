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
export default {
  name: 'App',

  data: () => ({
    loading: true
  }),
  created () {
    this.$db.items.get().then(response => {
      const items = response.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }))
      this.$store.dispatch('initializeStore', items).then(() => {
        this.loading = false
      })
    })
  }
}
</script>
