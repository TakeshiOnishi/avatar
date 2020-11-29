import React, { useState, createContext } from "react"
import PropTypes from "prop-types"
import firebase from "firebase/app"
import 'firebase/auth'
import 'firebase/database'
import "../styles/layout.scss"
import { Helmet } from "react-helmet"

if (typeof window !== "undefined") {
  var firebaseui = require('firebaseui');
}

// HACK: libにしたい & sizeをAPI化
export const rangeSizeMap = (sizeString) => {
  let rangePixel
  switch (sizeString) {
    case 'S': rangePixel = 50 / 2; break
    case 'M': rangePixel = 200 / 2; break
    case 'L': rangePixel = 400 / 2; break
    default: console.log('invalid val'); break;
  }
  return rangePixel
}

// HACK: libにしたい & sizeをAPI化 & マスタ管理
export const statusIdToString = (statusId) => {
  let statusLabel
  switch (parseInt(statusId)) {
    case 0: statusLabel = '離席してます'; break
    case 1: statusLabel = '集中してます'; break
    case 2: statusLabel = '会話できます'; break
    case 3: statusLabel = '会話に飢えてます'; break
    default: console.log('invalid val'); break;
  }
  return statusLabel
}


export const UserStateContext = createContext()

const Layout = ({ children }) => {
  const [myUserId, setMyUserId] = useState('')
  const [myUserName, setMyUserName] = useState('')
  const [myUserStatusId, setMyUserStatusId] = useState(0)
  const [myRangeSelect, setMyRangeSelect] = useState('M')
  const firebaseConfig = {
    apiKey: "AIzaSyCTPJpFP6vBuNhWwTDUZluq2zV-BatBtVU",
    authDomain: "multi-connect-f53ad.firebaseapp.com",
    databaseURL: "https://multi-connect-f53ad.firebaseio.com",
    projectId: "multi-connect-f53ad",
    storageBucket: "multi-connect-f53ad.appspot.com",
    messagingSenderId: "670019221729",
    appId: "1:670019221729:web:7ec5b662caacb81bcf5fa0",
    measurementId: "G-L7TTT4KBVC"
  };

  const uiConfig = {
    signInSuccessUrl: '/',
    signInOptions: [ firebase.auth.GoogleAuthProvider.PROVIDER_ID ]
  }

  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);

    // HACK: SSRでwindow無いエラーになるので一旦むりやり
    if (typeof window !== "undefined") {
      let ui = new firebaseui.auth.AuthUI(firebase.auth())
      firebase.auth().onAuthStateChanged( (user) => {
        if(user) {
          setMyUserId(user.uid)
          setMyUserName(user.displayName)
        }
        else {
          if(window.location.pathname !== '/login/') {
            window.location.replace(`/login/`)
          }
          ui.start('.js-firebaseAuth', uiConfig);
        }
      });
    }
  }

  const userState = {
    myUserId: myUserId, 
    myUserName: myUserName,
    myUserStatusId: myUserStatusId,
    setMyUserStatusId: setMyUserStatusId,
    myRangeSelect: myRangeSelect,
    setMyRangeSelect: setMyRangeSelect,
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
        <title>AVATAR</title>
      </Helmet>
      <UserStateContext.Provider value={userState}>
        <main>{children}</main>
      </UserStateContext.Provider>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
