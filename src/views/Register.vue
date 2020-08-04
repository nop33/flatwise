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
        this.$db.users.doc(firebase.auth().currentUser.uid).get().then(doc => {
          if (!doc.exists) {
            this.addNewUserToFirestore(user)
          } else {
            this.$router.push('/')
          }
        }).catch(error => {
          console.error('Checking if customer exists failed" ' + error)
        })
      }
    })
  },
  methods: {
    addNewUserToFirestore (user) {
      console.log(firebase.auth().currentUser.uid)
      const details = {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      }
      console.log(details)
      this.$db.users.doc(firebase.auth().currentUser.uid).set(details).then(() => {
        this.$router.push('/')
      })
    }
  }
}
</script>
