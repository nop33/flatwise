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

    <v-content>
       <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  data: () => ({
    //
  })
}
</script>
