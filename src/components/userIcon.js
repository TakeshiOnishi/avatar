import React, { useState, createContext, useEffect } from "react"
import { UserStateContext } from "../components/layout"
import Draggable from 'react-draggable'; // The default
import firebase from "firebase/app"
import 'firebase/auth'
import 'firebase/database'

const UserIcon = (props) => {
  let spaceName = 'user'
  let database = firebase.database()
  let attribute = props.attribute
  const [userId, setUserId] = useState('')
  const [userName, setUserName] = useState('')
  const [positionX, setPositionX] = useState(0)
  const [positionY, setPositionY] = useState(0)
  const [upddatedAt, setUpddatedAt] = useState(0)
  let offsetX,offsetY


  useEffect(
    () => {
      if (userId == '') { return }
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


  useEffect(
    () => {
      setUserId(attribute.id)
      setUserName(attribute.name)
      setPositionX(attribute.x)
      setPositionY(attribute.y)
      setUpddatedAt(attribute.date)
    }, [attribute]
  )

  const handleStop = (ev, ui) => {
    let now = new Date();
    props.modifyUserIcon({
      id: userId,
      name: userName,
      x: ui.x,
      y: ui.y,
      date: now.getTime()
    })
  }

  return(
    <>
      <Draggable 
        bounds="parent"
        position={{x: positionX, y: positionY}}
        onStop={handleStop}
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
