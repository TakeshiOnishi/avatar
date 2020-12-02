import React, { useState, useEffect, useContext } from "react"
import { AppGlobalContext, statusIdToString } from "./layout"
import { VirtualAreaContext } from "./virtualArea"
import dayjs from "dayjs"
import Draggable from 'react-draggable'
import { toast } from 'react-toastify'
import Push from "push.js"
import IconSquare from "../images/icon_small.jpg"

const UserIcon = (props) => {
  const { 
    myUserId, 
    firebaseDB,
    spaceNameForUser,
    spaceNameForChat,
    spaceNameForStatus,
    spaceNameForUserSetting,
  } = useContext(AppGlobalContext)
  const { 
    userIconWidth, 
    userIconPadding,
    setUserPositions,
  } = useContext(VirtualAreaContext)

  const [isMe, setIsMe] = useState(false)
  const [userId] = useState(props.id)
  const [userName, setUserName] = useState('')
  const [userStatusId, setUserStatusId] = useState(0)
  const [positionX, setPositionX] = useState(0)
  const [positionY, setPositionY] = useState(0)
  const [dragPxCount, setDragPxCount] = useState(0)
  const [chatMessageList, setChatMessageList] = useState([])
  const [userIconStyle, setUserIconStyle] = useState({
    width: `${userIconWidth}px`,
    height: `${userIconWidth}px`,
    padding: `${userIconPadding}px`
  })

  const chatFreshnessSecond = -10

  const initUserIcon = () => {
    firebaseDB.ref(`${spaceNameForUser}/${userId}`).once('value', data => {
      const fbVal = data.val()
      setUserName(fbVal.name)
      setPositionX(fbVal.x)
      setPositionY(fbVal.y)
    })
  }

  const receiveUserIconPositionChange = () => {
    firebaseDB.ref(`${spaceNameForUser}/${userId}`).on("child_changed", data => {
      const fbKey = data.key
      const fbVal = data.val()
      switch (fbKey) {
        case 'name': setUserName(fbVal); break
        case 'x': setPositionX(fbVal); break
        case 'y': setPositionY(fbVal); break
        default: console.log('invalid key'); break;
      }
    })
  }

  const receiveUserIconImageChange = () => {
    firebaseDB.ref(`${spaceNameForUserSetting}/${userId}`).on('value', data => {
      const fbVal = data.val()
      if (fbVal === null) { return }
      setUserIconStyle(Object.assign(userIconStyle, {
        backgroundImage: `url(${fbVal.iconURL})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
      }))
    })
  }

  const receiveUserIconStatus = () => {
    firebaseDB.ref(`${spaceNameForStatus}/${userId}`).on('value', data => {
      const fbVal = data.val()
      if (fbVal === null) { return }
      setUserStatusId(fbVal.statusId)
    })
  }

  const receiveMessage = () => {
    firebaseDB.ref(`${spaceNameForChat}/${userId}`).on('value', data => {
      const fbVal = data.val()
      if (fbVal === null) { return }
      let secondDiff = dayjs(fbVal.date).diff(dayjs(), 'second')
      if(secondDiff >= chatFreshnessSecond){
        if(fbVal.targetUserIds === undefined) { return }
        let messageToMe = fbVal.targetUserIds.includes(myUserId)
        if(messageToMe){
          Push.create(`${fbVal.name}さんからチャットが届きました`, {
            body: fbVal.message,
            icon: IconSquare,
            onClick: ev => {
              window.focus()
              ev.currentTarget.close()
            }
          })

          setChatMessageList(current => 
            [...current, fbVal.message]
          )
        }
      }
    })
  }

  useEffect(
    () => {
      setIsMe(myUserId === userId)
      initUserIcon()
      receiveUserIconPositionChange()
      receiveUserIconImageChange()
      receiveUserIconStatus()
      receiveMessage()
    }, [ userId ]
  )

  useEffect(
    () => {
      setUserPositions(current => {
        return {...current, [userId]: { x: positionX, y: positionY, statusId: userStatusId}}
      })
    }, [userId, userStatusId, positionX, positionY, setUserPositions]
  )

  const userIconOnDrag = (_ev, ui) => {
    setDragPxCount(dragPxCount + 1)
    if (dragPxCount % 15 === 0) {
      updateFirebasePosition(ui)
    }
  }
  const userIconOnStop = (_ev, ui) => {
    updateFirebasePosition(ui)
  }

  const updateFirebasePosition = (ui) => {
    firebaseDB.ref(`${spaceNameForUser}/${userId}`).set({
      name: userName,
      x: ui.x,
      y: ui.y,
    })
  }

  const messageAnimationEnd = ev => {
    ev.target.style.display = 'none'
  }

  return(
    <>
      <AppGlobalContext.Consumer>
        {(user) => {
          return (
            <Draggable 
            bounds="parent"
            position={{x: positionX, y: positionY}}
            onDrag={userIconOnDrag}
            onStop={userIconOnStop}
            disabled={isMe ? false : true}
            >
              <div data-id={userId} 
                className={`userIcon  ${isMe ? 'myUserIcon': 'userIcon'} iconStatus${userStatusId}`}
                style={userIconStyle}
              >
                <p>{userName}</p>
                <p>{statusIdToString(userStatusId)}</p>
                {chatMessageList.map((chatMessage, index) => 
                  <div key={index} className='chatMessage' onAnimationEnd={messageAnimationEnd}>
                    <div>
                      <p>
                        [{userName}] {chatMessage}
                      </p>
                    </div>
                  </div>
                )}
                {isMe && <div className={`rangeSize${user.myRange}`} />}
              </div>
            </Draggable>
          )
        }}
      </AppGlobalContext.Consumer>
    </>
  )
}

export default UserIcon
