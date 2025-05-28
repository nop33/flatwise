import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'

require('dotenv').config()

const firebaseApp = firebase.initializeApp({
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID
})

export default firebaseApp.firestore()
