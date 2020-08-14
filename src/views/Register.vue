<template>
  <div></div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  created () {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const currentUserId = firebase.auth().currentUser.uid
        this.$db.users.doc(currentUserId).get().then(doc => {
          if (!doc.exists) {
            this.$store.dispatch('registerUser', {
              id: user.uid,
              name: user.displayName,
              email: user.email,
              photo: user.photoURL
            }).then(() => {
              this.$router.push('/')
            })
          } else {
            this.$router.push('/')
          }
        }).catch(error => {
          console.error('Checking if user exists failed" ' + error)
        })
      }
    })
  }
}
</script>
