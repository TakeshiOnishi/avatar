import React from "react"
import { UserStateContext } from "../components/layout"
import dayjs from "dayjs"
import firebase from "firebase/app"
import 'firebase/auth'
import 'firebase/database'

const StatusControl = () => {
  let spaceName = 'user'
  let database = firebase.database()

  const joinRoom = (myUserId, myUserName) => {
    database.ref(`${spaceName}/${myUserId}`).set({
      id: myUserId,
      name: myUserName,
      x: 0,
      y: 0,
      date: dayjs().format('MM/DD HH:mm:ss')
    })
  }

  const outRoom = (myUserId) => {
    database.ref(`${spaceName}/${myUserId}`).remove()
  }

  return(
    <>
      <UserStateContext.Consumer>
      {(user) => {
        return (
          <>
            <input type='button' className="joinRoomBtn" value='入室' onClick={() => {joinRoom(user.myUserId, user.myUserName)}} />
            <input type='button' className="outRoomBtn" value='退出' onClick={() => {outRoom(user.myUserId)}} />
          </>
        )
      }}
      </UserStateContext.Consumer>
    </>
  )
}

export default StatusControl
