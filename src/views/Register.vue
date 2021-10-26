<template>
  <div></div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

import { createUserObject } from '../store/models.js'

export default {
  created() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const currentUserId = firebase.auth().currentUser.uid
        this.$db.users
          .doc(currentUserId)
          .get()
          .then((doc) => {
            if (!doc.exists) {
              const newUser = createUserObject(user.uid, user.displayName, user.email, user.photoURL)
              this.$store.dispatch('registerUser', newUser).then(() => {
                this.$router.push('/')
              })
            } else {
              this.$router.push('/')
            }
          })
          .catch((error) => {
            console.error('Checking if user exists failed" ' + error)
          })
      }
    })
  }
}
</script>
