<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >

      <v-btn to="/add">
        <v-icon>mdi-plus</v-icon>
        <span>Add item</span>
      </v-btn>

      <v-spacer></v-spacer>

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
