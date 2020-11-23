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
  let offsetX,offsetY

  useEffect(
    () => {
      setPositionX(positionX)
    }, [positionX]
  )
  useEffect(
    () => {
      setPositionY(positionY)
    }, [positionY]
  )
  useEffect(
    () => {
      setUserId(attribute.id)
      setUserName(attribute.name)
      setPositionX(attribute.x)
      setPositionY(attribute.y)
    }, [props]
  )

  const handleStop = (ev, ui) => {
    let afterX = ui.x
    let afterY = ui.y
    let now = new Date();

    setPositionX(afterX)
    setPositionY(afterY)

    database.ref(`${spaceName}/${userId}`).set({
      id: userId,
      name: userName,
      x: afterX,
      y: afterY,
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
