import React, { useState, useEffect } from "react"
import { UserStateContext } from "../components/layout"
import Draggable from 'react-draggable'; // The default
import firebase from "firebase/app"
import dayjs from "dayjs"
import 'firebase/auth'
import 'firebase/database'

const UserIcon = (props) => {
  let spaceName = 'user'
  let database = firebase.database()
  const [userId, setUserId] = useState('')
  const [userName, setUserName] = useState('')
  const [positionX, setPositionX] = useState(0)
  const [positionY, setPositionY] = useState(0)
  const [updatedAt, setUpdatedAt] = useState(0)
  const [dragPxCount, setDragPxCount] = useState(0)

  const updateIconAttr = iconAttrObj => {
    setUpdatedAt(iconAttrObj.date)
    setUserName(iconAttrObj.name)
    setPositionX(iconAttrObj.x)
    setPositionY(iconAttrObj.y)
  }

  useEffect(
    () => {
      setUserId(props.id)
    }, [props.id]
  )

  useEffect(
    () => {
      if (userId === '') { return }

      database.ref(`${spaceName}/${userId}`).once('value', data => {
        updateIconAttr(data.val())
      })

      database.ref(`${spaceName}/${userId}`).on("child_changed", data => {
        const fbKey = data.key
        const fbVal = data.val()
        switch (fbKey) {
          case 'date': setUpdatedAt(fbVal); break
          case 'name': setUserName(fbVal); break
          case 'x': setPositionX(fbVal); break
          case 'y': setPositionY(fbVal); break
          default: console.log('invalid key'); break;
        }
      })
    }, [userId, spaceName, database]
  )

  const handleDrag = (_ev, ui) => {
    setDragPxCount(dragPxCount + 1)
    if (dragPxCount % 20 === 0) {
      setFirebaseDB(ui)
    }
  }
  const handleStop = (_ev, ui) => {
    setFirebaseDB(ui)
  }

  const setFirebaseDB = (ui) => {
    database.ref(`${spaceName}/${userId}`).set({
      id: userId,
      name: userName,
      x: ui.x,
      y: ui.y,
      date: dayjs().format('MM/DD HH:mm:ss')
    })
  }

  return(
    <>
      <UserStateContext.Consumer>
        {(user) => {
          let isMe = true // (user.myUserId == userId)
          if(isMe){
            return (
              <Draggable 
              bounds="parent"
              position={{x: positionX, y: positionY}}
              onDrag={handleDrag}
              onStop={handleStop}
              >
              <div className="userIcon myUserIcon">
                <p>{userName}</p>
                <p>({positionX}, {positionY})</p>
                <p className='lastTime'>{updatedAt}</p>
              </div>
              </Draggable>
            )
          }else{
            return (
            <Draggable 
              position={{x: positionX, y: positionY}}
              disabled={true}
            >
              <div className="userIcon">
                <p>{userName}</p>
                <p>({positionX}, {positionY})</p>
                <p className='lastTime'>{updatedAt}</p>
              </div>
            </Draggable>
            )
          }
        }}
      </UserStateContext.Consumer>
    </>
  )
}

export default UserIcon
