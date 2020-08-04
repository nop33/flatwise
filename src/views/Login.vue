<template>
  <section id="firebaseui-auth-container"></section>
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
      signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID]
    }
    ui.start('#firebaseui-auth-container', uiConfig)
  }
}
</script>
