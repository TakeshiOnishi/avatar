import React, { useState, createContext, useEffect } from "react"
import { UserStateContext } from "../components/layout"
import Draggable from 'react-draggable'; // The default
import firebase from "firebase/app"
import 'firebase/auth'
import 'firebase/database'

const UserIcon = (props) => {
  let spaceName = 'user'
  let database = firebase.database()
  const [userId, setUserId] = useState('')
  const [userName, setUserName] = useState('')
  const [positionX, setPositionX] = useState(0)
  const [positionY, setPositionY] = useState(0)
  const [upddatedAt, setUpddatedAt] = useState(0)
  const [dragPxCount, setDragPxCount] = useState(0)

  const updateIconAttr = iconAttrObj => {
    setUpddatedAt(iconAttrObj.date)
    setUserName(iconAttrObj.name)
    setPositionX(iconAttrObj.x)
    setPositionY(iconAttrObj.y)
  }

  useEffect(
    () => {
      setUserId(props.id)
    }, []
  )

  useEffect(
    () => {
      if (userId == '') { return }

      database.ref(`${spaceName}/${userId}`).once('value', data => {
        updateIconAttr(data.val())
      })

      database.ref(`${spaceName}/${userId}`).on("child_changed", data => {
        const fbKey = data.key
        const fbVal = data.val()
        switch (fbKey) {
          case 'date': setUpddatedAt(fbVal); break
          case 'name': setUserName(fbVal); break
          case 'x': setPositionX(fbVal); break
          case 'y': setPositionY(fbVal); break
          default: console.log('invalid key'); break;
        }
      })
    }, [userId]
  )

  const handleDrag = (_ev, ui) => {
    setDragPxCount(dragPxCount + 1)
    if (dragPxCount % 20 == 0) {
      let now = new Date();
      database.ref(`${spaceName}/${userId}`).set({
        id: userId,
        name: userName,
        x: ui.x,
        y: ui.y,
        date: now.getTime()
      })
    }
  }

  return(
    <>
      <Draggable 
        bounds="parent"
        position={{x: positionX, y: positionY}}
        onDrag={handleDrag}
      >
        <div className="userIcon">
          <p>{userName}</p>
          <p>({positionX}, {positionY})</p>
        </div>
      </Draggable>
    </>
  )
}

export default UserIcon
