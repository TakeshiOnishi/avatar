import React, { useEffect, useContext, useRef } from "react"
import { AppGlobalContext, statusIdToString } from "./layout"
import { toast } from 'react-toastify';

const StatusControl = () => {
  const { 
    myUserId, 
    myUserName,
    setMyUserStatusId,
    firebaseDB,
    spaceNameForUser,
    spaceNameForStatus,
  } = useContext(AppGlobalContext)

  let statusIdSelect = useRef()

  const joinRoom = (myUserId, myUserName) => {
    firebaseDB.ref(`${spaceNameForUser}/${myUserId}`).set({
      id: myUserId,
      name: myUserName,
      x: 0,
      y: 0,
    })
    toast.success(`部屋に参加しました。`);
  }

  const outRoom = (myUserId) => {
    firebaseDB.ref(`${spaceNameForUser}/${myUserId}`).remove()
    toast.success(`部屋から退室しました。`);
  }

  const handleStatusChange = ev => {
    let statusId = ev.target.value //HACK: validCheck
    firebaseDB.ref(`${spaceNameForStatus}/${myUserId}`).set({
      statusId: statusId
    })
    toast.success(`ステータスを更新しました。`);
  }

  const initStatus = () => {
    firebaseDB.ref(`${spaceNameForStatus}/${myUserId}`).once('value', data => {
      const fbVal = data.val()
      if(fbVal !== null && statusIdSelect.current) {
        statusIdSelect.current.value = fbVal.statusId
        setMyUserStatusId(fbVal.statusId)
      }
    })
  }

  useEffect(
    () => {
      initStatus()
    }, []
  )

  return(
    <>
      <AppGlobalContext.Consumer>
      {(user) => {
        return (
          <>
            <div className='statusControl'>
              <div className='myStatus'>
                <select defaultValue='0' className="statusIdSelect" onBlur={null} onChange={handleStatusChange} ref={statusIdSelect}>
                  {[0,1,2,3].map(id => 
                    <option key={id} value={id}>{statusIdToString(id)}</option>
                  )}
                </select>
              </div>

              <div className='myUserInfo'>
                <p>【ユーザーID】 {myUserId}</p>
                <p>【ユーザー名】 {myUserName}</p>
              </div>

              <input type='button' className="joinRoomBtn" value='入室' onClick={() => {joinRoom(user.myUserId, user.myUserName)}} />
              <input type='button' className="outRoomBtn" value='退出' onClick={() => {outRoom(user.myUserId)}} />
            </div>
          </>
        )
      }}
      </AppGlobalContext.Consumer>
    </>
  )
}

export default StatusControl
