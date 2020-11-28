import React, { useState, useEffect, useContext } from "react"
import { UserStateContext } from "../components/layout"
import Draggable from 'react-draggable'; // The default
import firebase from "firebase/app"
import dayjs from "dayjs"
import 'firebase/auth'
import 'firebase/database'

const UserIcon = (props) => {
  const { myUserId } = useContext(UserStateContext)
  const chatFreshnessSecond = -600
  let spaceName = 'user'
  let chatSpaceName = 'chat' // TODO: この辺の変数名をglobal化
  let database = firebase.database()
  const setUserPositions = props.setUserPositions
  const [userId, setUserId] = useState('')
  const [userName, setUserName] = useState('')
  const [positionX, setPositionX] = useState(0)
  const [positionY, setPositionY] = useState(0)
  const [updatedAt, setUpdatedAt] = useState(0)
  const [dragPxCount, setDragPxCount] = useState(0)
  const [chatMessageList, setChatMessageList] = useState([])

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

      database.ref(`${chatSpaceName}/${userId}`).on('value', data => {
        const fbVal = data.val()
        if (fbVal === null) { return }
        let secondDiff = dayjs(fbVal.date).diff(dayjs(), 'second')
        if(secondDiff >= chatFreshnessSecond){
          let messageToMe = fbVal.targetUserIds.includes(myUserId)
          if(messageToMe){
            setChatMessageList(current => 
              [...current, fbVal.message]
            )
          }
        }
      })

    }, [userId, spaceName, chatSpaceName, database]
  )

  useEffect(
    () => {
      if (userId === '') { return }
      setUserPositions(current => {
        return {...current, [userId]: { x: positionX, y: positionY}}
      })
    }, [userId, positionX, positionY, setUserPositions]
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
      date: dayjs().format('YYYY/MM/DD HH:mm:ss')
    })
  }

  const handleAnimationEnd = ev => {
    ev.target.style.display = 'none'
  }

  return(
    <>
      <UserStateContext.Consumer>
        {(user) => {
          // let isMe = true
          let isMe = (user.myUserId == userId)
          if(isMe){
            return (
              <Draggable 
              bounds="parent"
              position={{x: positionX, y: positionY}}
              onDrag={handleDrag}
              onStop={handleStop}
              >
                <div data-id={userId} className='userIcon myUserIcon'>
                  <p>{userName}</p>
                  <p>({positionX}, {positionY})</p>
                  <p className='lastTime'>{updatedAt}</p>
                  <div className={`rangeSize${user.myRangeSelect}`} />
                  {chatMessageList.map((chatMessage, index) => 
                    <div key={index} className='chatMessage' onAnimationEnd={handleAnimationEnd}>
                      <div>
                        <p>
                          {chatMessage}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Draggable>
            )
          }else{
            return (
            <Draggable 
              position={{x: positionX, y: positionY}}
              disabled={true}
            >
              <div data-id={userId} className='userIcon'>
                <p>{userName}</p>
                <p>({positionX}, {positionY})</p>
                <p className='lastTime'>{updatedAt}</p>
                {chatMessageList.map((chatMessage, index) => 
                  <div key={index} className='chatMessage' onAnimationEnd={handleAnimationEnd}>
                    <div>
                      <p>
                        {chatMessage}
                      </p>
                    </div>
                  </div>
                )}
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
