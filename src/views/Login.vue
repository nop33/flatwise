<template>
  <v-container class="fill-height sign-in" fluid>
    <v-row align="center" justify="center">
      <v-col>
        <div class="text-center">
          <img src="../assets/logo.png" />
        </div>
        <div class="text-center text-h3" style="color: #66757f">Flatwise</div>
        <section id="firebaseui-auth-container"></section>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

export default {
  mounted() {
    const ui = new firebaseui.auth.AuthUI(firebase.auth())
    const uiConfig = {
      signInSuccessUrl: '/register',
      signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID, firebase.auth.EmailAuthProvider.PROVIDER_ID]
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
