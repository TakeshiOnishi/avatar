import React, { useEffect, useContext } from "react"
import { AppGlobalContext, statusIdToString } from "../components/layout"
import dayjs from "dayjs"
import firebase from "firebase/app"
import 'firebase/auth'
import 'firebase/database'
import { toast } from 'react-toastify';

const StatusControl = () => {
  const { myUserId, myUserName, setMyUserStatusId, setMyUserIconUrl } = useContext(AppGlobalContext)
  let spaceName = 'user'
  let statusSpaceName = 'status'
  let database = firebase.database()
  let statusIdSelect
  // HACK: SSRでwindow無いエラーになるので一旦むりやり
  if (typeof window !== "undefined") {
    statusIdSelect = document.querySelector('.myStatus .statusIdSelect')
  }

  const joinRoom = (myUserId, myUserName) => {
    database.ref(`${spaceName}/${myUserId}`).set({
      id: myUserId,
      name: myUserName,
      x: 0,
      y: 0,
      date: dayjs().format('MM/DD HH:mm:ss')
    })
    toast.success(`部屋に参加しました。`);
  }

  const outRoom = (myUserId) => {
    database.ref(`${spaceName}/${myUserId}`).remove()
    toast.success(`部屋から退室しました。`);
  }

  const handleStatusChange = ev => {
    let statusId = ev.target.value //HACK: validCheck
    database.ref(`${statusSpaceName}/${myUserId}`).set({
      statusId: statusId
    })
    toast.success(`ステータスを更新しました。`);
  }

  useEffect(
    () => {
      if(myUserId === '') { return }
      firebase.database().ref(`${statusSpaceName}/${myUserId}`).once('value', data => {
        const fbVal = data.val()
        if(fbVal !== null && statusIdSelect) {
          statusIdSelect.value = fbVal.statusId
          setMyUserStatusId(fbVal.statusId)
        }
      })

      let userSettingSpaceName = 'user_setting' // TODO: この辺の変数名をglobal化
      firebase.database().ref(`${userSettingSpaceName}/${myUserId}`).once('value', data => {
        const fbVal = data.val()
        if(fbVal !== null) {
          setMyUserIconUrl(fbVal.iconURL)
        }
      })
    }, [statusIdSelect, myUserId, setMyUserStatusId, statusSpaceName]
  )

  return(
    <>
      <AppGlobalContext.Consumer>
      {(user) => {
        return (
          <>
            <div className='statusControl'>
              <div className='myStatus'>
                <select defaultValue='0' className="statusIdSelect" onBlur={null} onChange={handleStatusChange}>
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
