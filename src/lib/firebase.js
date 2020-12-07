import firebase from "firebase/app"
import 'firebase/auth'
import 'firebase/database'
import {FirebaseConfig} from './firebaseConfig'

let firebaseui
if (typeof window !== "undefined") {
  firebaseui = require('firebaseui');
}

const loginPath = '/login/'
const firebaseAuthClassName = '.js-firebaseAuth'

const firebaseUiConfig = {
  signInSuccessUrl: '/',
  signInOptions: [ firebase.auth.GoogleAuthProvider.PROVIDER_ID ]
}

export const createFirebaseDatabase = () => {
  return firebase.database()
}

export const firebaseLogin = async () => {
  if (firebase.apps.length === 0) {
    firebase.initializeApp(FirebaseConfig)
    if (typeof window !== "undefined") {
      let res = await firebaseAuth()
      return res
    }
  }else{
    return null
  }
}

const firebaseAuth = () => {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged( (user) => {
      if(user) {
        resolve(user)
      } else {
        if(window.location.pathname !== loginPath) {
          window.location.replace(loginPath)
        }
        let ui = new firebaseui.auth.AuthUI(firebase.auth())
        ui.start(firebaseAuthClassName, firebaseUiConfig);
        resolve(null)
      }
    })
  })
}
