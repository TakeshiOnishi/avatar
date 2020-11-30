import firebase from "firebase/app"
import 'firebase/auth'
import 'firebase/database'

let firebaseui
if (typeof window !== "undefined") {
  firebaseui = require('firebaseui');
}

const loginPath = '/login/'
const firebaseAuthClassName = '.js-firebaseAuth'

const firebaseConfig = {
  apiKey: "AIzaSyCTPJpFP6vBuNhWwTDUZluq2zV-BatBtVU",
  authDomain: "multi-connect-f53ad.firebaseapp.com",
  databaseURL: "https://multi-connect-f53ad.firebaseio.com",
  projectId: "multi-connect-f53ad",
  storageBucket: "multi-connect-f53ad.appspot.com",
  messagingSenderId: "670019221729",
  appId: "1:670019221729:web:7ec5b662caacb81bcf5fa0",
  measurementId: "G-L7TTT4KBVC"
}

const firebaseUiConfig = {
  signInSuccessUrl: '/',
  signInOptions: [ firebase.auth.GoogleAuthProvider.PROVIDER_ID ]
}

export const createFirebaseDatabase = () => {
  return firebase.database()
}

export const firebaseLogin = async () => {
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig)
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
