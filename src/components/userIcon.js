import React, { useState, useEffect, useContext } from "react"
import { AppGlobalContext, statusIdToString, statusIdToColorCode, statusIdToActive, rangeSizeTxtToPixel, moodScoreToIcon } from "./layout"
import { VirtualAreaContext } from "./virtualArea"
import dayjs from "dayjs"
import Draggable from 'react-draggable'
import { toast } from 'react-toastify'
import Push from "push.js"
import ReactTooltip from 'react-tooltip'
import IconSquare from "../images/icon_small.jpg"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { Avatar, Badge } from '@material-ui/core'

const UserIcon = (props) => {
  const { 
    myUserId, 
    firebaseDB,
    spaceNameForUser,
    spaceNameForChat,
    spaceNameForStatus,
    spaceNameForUserSetting,
    spaceNameForUserMood,
  } = useContext(AppGlobalContext)
  const { 
    userIconWidth, 
    userIconPadding,
    setUserPositions,
    setAllChatMessageToMeList,
  } = useContext(VirtualAreaContext)

  const [isMe, setIsMe] = useState(false)
  const [userId] = useState(props.id)
  const [userName, setUserName] = useState('')
  const [userStatusId, setUserStatusId] = useState(0)
  const [userMood, setUserMood] = useState(0)
  const [userIconUrl, setUserIconUrl] = useState('')
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

  const initUserMood = () => {
    firebaseDB.ref(`${spaceNameForUserMood}/${userId}`).once('value', data => {
      const fbVal = data.val()
      if(fbVal === null) { return }
      setUserMood(fbVal.moodScore)
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
      setUserIconUrl(fbVal.iconURL)
    })
  }

  const receiveUserIconStatus = () => {
    firebaseDB.ref(`${spaceNameForStatus}/${userId}`).on('value', data => {
      const fbVal = data.val()
      if (fbVal === null) { return }
      setUserStatusId(fbVal.statusId)
    })
  }

  const receiveUserMood = () => {
    firebaseDB.ref(`${spaceNameForUserMood}/${userId}`).on('value', data => {
      const fbVal = data.val()
      if (fbVal === null) { return }
      setUserMood(fbVal.moodScore)
    })
  }

  const receiveMessage = () => {
    firebaseDB.ref(`${spaceNameForChat}/${userId}`).off()
    firebaseDB.ref(`${spaceNameForChat}/${userId}`).on('value', data => {
      const fbVal = data.val()
      if (fbVal === null) { return }
      let secondDiff = dayjs(fbVal.date).diff(dayjs(), 'second')
      if(secondDiff >= chatFreshnessSecond){
        if(fbVal.targetUserIds === undefined) { return }
        let messageToMe = fbVal.targetUserIds.includes(myUserId)
        if(messageToMe){
          Push.create(`${userName}さんからチャットが届きました`, {
            body: fbVal.message,
            icon: IconSquare,
            onClick: ev => {
              window.focus()
              ev.currentTarget.close()
            },
            timeout: 2000
          })
        setChatMessageList(current => [...current, fbVal.message])
        setAllChatMessageToMeList(current => 
          [...current, {name: userName, iconUrl: userIconUrl, message: fbVal.message, date: fbVal.date}])
        }
      }
    })
  }

  useEffect(
    () => {
      setIsMe(myUserId === userId)
      initUserIcon()
      initUserMood()
      receiveUserIconPositionChange()
      receiveUserIconImageChange()
      receiveUserIconStatus()
      receiveUserMood()
    }, []
  )

  useEffect(
    () => {
      receiveMessage()
    }, [ userName, userIconUrl ]
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
    if (dragPxCount % 10 === 0) {
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
            position={{x: positionX, y: positionY}}
            onDrag={userIconOnDrag}
            onStop={userIconOnStop}
            disabled={isMe ? false : true}
            >
              <div data-tip data-for={`reactTip${userId}`}>
                {!isMe && <ReactTooltip id={`reactTip${userId}`} backgroundColor='#FFF' textColor='#332D2DD4' border={true} borderColor='#00000014'>
                  <p style={{margin: '5px'}}>{userName}</p>
                  <p style={{margin: '5px'}}>{statusIdToString(userStatusId)}</p>
                </ReactTooltip>
                }
                <Badge
                  overlap="circle"
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  badgeContent={<FontAwesomeIcon icon={moodScoreToIcon(userMood)} style={{fontSize: '1.3rem', background: '#FFF', color: '#715246', borderRadius: '50%'}} />}
                  style={{
                    position: 'absolute',
                    cursor: 'pointer',
                  }}
                >
                  <div id={`userIcon-${userId}`}>
                    <Avatar alt={userName} src={userIconUrl} style={{
                        border: '5px double',
                        boxSizing: 'border-box',
                        borderColor: statusIdToColorCode(userStatusId),
                        width: userIconWidth,
                        height: userIconWidth,
                        opacity: statusIdToActive(userStatusId) ? '0.25' : '1',
                        pointerEvents: 'none',
                      }} 
                      className={userStatusId === 3 ? 'rainbowC' : '' }
                    />
                    {isMe && <div style={{
                      boxSizing: 'border-box',
                      position: 'absolute',
                      content: '',
                      width: userIconWidth + rangeSizeTxtToPixel(user.myRange),
                      height: userIconWidth + rangeSizeTxtToPixel(user.myRange),
                      top: rangeSizeTxtToPixel(user.myRange) / 2 * -1,
                      left: rangeSizeTxtToPixel(user.myRange) / 2 * -1,
                      border: '2px dotted #A69286',
                      borderRadius: '50%',
                    }} />}

                    <div style={{position: 'absolute'}}>
                      {chatMessageList.map((chatMessage, index) => 
                        <div key={index} className='chatMessage' onAnimationEnd={messageAnimationEnd}>
                          <p style={{fontSize: '0.5rem', color: '#777', margin: 0}}>{userName}</p>
                          <p style={{margin:0}}>{chatMessage}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Badge>
                <ReactTooltip />
              </div>
            </Draggable>
          )
        }}
      </AppGlobalContext.Consumer>
    </>
  )
}

export default UserIcon
