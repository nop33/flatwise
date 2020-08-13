<template>
  <v-container class="fill-height sign-in" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <div class="text-center text-h1">🏠</div>
        <div class="text-center text-h3">Flatwise</div>
        <section id="firebaseui-auth-container"></section>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

export default {
  mounted () {
    var ui = new firebaseui.auth.AuthUI(firebase.auth())
    var uiConfig = {
      signInSuccessUrl: '/register',
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ]
    }
    ui.start('#firebaseui-auth-container', uiConfig)
  }
}
</script>

<style lang="scss">
.sign-in .firebaseui-idp-list {
  padding-left: 0;
}
</style>
