import React, { useState, createContext } from "react"
import PropTypes from "prop-types"
import "../styles/layout.scss"
import { Helmet } from "react-helmet"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Push from "push.js"

import Icon32 from "../images/favicon-32x32.jpg"
import AppleTouchIcon from "../images/apple-touch-icon.jpg"
import IconSquare from "../images/icon_small.jpg"
import IconSquareGif from "../images/icon.gif"

// 感情順番 + -> -
import { 
  faSmileWink, faLaughSquint,
  faMehBlank,
  faFrownOpen, faDizzy
} from "@fortawesome/free-regular-svg-icons"

import { firebaseLogin, createFirebaseDatabase } from "../lib/firebase"

// HACK: libにしたい
export const moodScoreToIcon = (moodScore) => {
  let tag
  switch (parseInt(moodScore)) {
    case  2: tag = faLaughSquint; break
    case  1: tag = faSmileWink; break
    case  0: tag = faMehBlank; break
    case  -1: tag = faFrownOpen; break
    case  -2: tag = faDizzy; break
    default: console.log('invalid val'); break;
  }
  return tag
}
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
export const statusIdToColorCode = (statusId) => {
  let statusLabel
  switch (parseInt(statusId)) {
    case 0: statusLabel = '#44A68F'; break
    case 1: statusLabel = '#B36470'; break
    case 2: statusLabel = '#5D69A6'; break
    case 3: statusLabel = 'linear-gradient(to right, red, orange, yellow, green, aqua, blue, purple)'; break
    default: console.log('invalid val'); break;
  }
  return statusLabel
}
export const statusIdToActive = (statusId) => {
  if([0, 1].includes(parseInt(statusId))){
    return true
  }else{
    return false
  }
}
export const rangeSizeTxtToPixel = (rangeSizeTxt) => {
  let pixel
  switch (rangeSizeTxt) {
    case 'S': pixel = 50; break
    case 'M': pixel = 200; break
    case 'L': pixel = 400; break
    default: console.log('invalid val'); break;
  }
  return pixel
}


export const AppGlobalContext = createContext()

const Layout = ({ path, children }) => {
  // FirebaseSettng
  const [firebaseDB, setFirebaseDB] = useState()
  const [spaceNameForUser] = useState('user')
  const [spaceNameForNotifyApproach] = useState('notify_approach')
  const [spaceNameForChat] = useState('chat')
  const [spaceNameForStatus] = useState('status')
  const [spaceNameForUserSetting] = useState('user_setting')
  const [spaceNameForUserMood] = useState('user_mood')

  // myStatus
  const [myUserId, setMyUserId] = useState('')
  const [myUserName, setMyUserName] = useState('')
  const [myUserStatusId, setMyUserStatusId] = useState(0)
  const [myUserIconUrl, setMyUserIconUrl] = useState('')
  const [myRange, setMyRange] = useState('M')
  const [myMood, setMyMood] = useState(0)
  const [myGoogleIconUrl, setMyGoogleIconUrl] = useState('')
  const [myJoinState, setMyJoinState] = useState(false)

  firebaseLogin().then(res =>{
    if(res !== null){
      setMyUserId(res.uid)
      setMyUserName(res.displayName)
      setMyGoogleIconUrl(res.photoURL)
      setFirebaseDB(createFirebaseDatabase())
    }
  })

  const appGlobalState = {
    firebaseDB, 
    spaceNameForUser, 
    spaceNameForChat, 
    spaceNameForStatus, 
    spaceNameForUserMood,
    myUserId, 
    myUserName,
    myUserStatusId,
    setMyUserStatusId,
    myUserIconUrl,
    setMyUserIconUrl,
    myGoogleIconUrl,
    myRange,
    setMyRange,
    myMood,
    setMyMood,
    myJoinState,
    setMyJoinState,
    spaceNameForUserSetting,
    spaceNameForNotifyApproach,
  }

  const isLoginPage = () => {
    if (typeof window !== "undefined") {
      if(window.location.pathname === '/login/') { 
        return true
      }
    }
  }

  if (typeof navigator !== "undefined") {
    if(!Push.Permission.has()){
      Push.Permission.request(() => { Push.create('通知許可されました!')})
    }
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
        <link rel="apple-touch-icon" sizes="180x180" href={AppleTouchIcon} />
        <link rel="icon" type="image/png" sizes="32x32" href={Icon32} />
        <title>AVATAR</title>
      </Helmet>
      <AppGlobalContext.Provider value={appGlobalState}>
        {isLoginPage() || firebaseDB !== undefined ? ( 
          <main>{children}</main>
        ) : (
          <main></main>
        ) }
      </AppGlobalContext.Provider>
      <ToastContainer autoClose={3000} position='bottom-left' pauseOnFocusLoss={false} />
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
