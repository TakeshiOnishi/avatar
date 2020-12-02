import React, { useEffect, useContext, useRef } from "react"
import { AppGlobalContext } from "./layout"
import "../styles/layout.scss"
import Modal from "react-modal"
import { toast } from 'react-toastify'

const UserSettingModal = props => {
  Modal.setAppElement('body')

  let inputUrl = useRef()

  const { 
    myUserId, 
    myUserIconUrl, 
    setMyUserIconUrl, 
    myGoogleIconUrl,
    firebaseDB,
    spaceNameForUserSetting,
  } = useContext(AppGlobalContext)

  const clickFromGoogleIcon = ev => {
    inputUrl.current.value = myGoogleIconUrl
  }

  const initIcon = () => {
    firebaseDB.ref(`${spaceNameForUserSetting}/${myUserId}`).once('value', data => {
      const fbVal = data.val()
      if(fbVal !== null) {
        setMyUserIconUrl(fbVal.iconURL)
      }
    })
  }

  const clickSubmitUrl = ev => {
    let inputUrlVal = inputUrl.current.value
    firebaseDB.ref(`${spaceNameForUserSetting}/${myUserId}`).set({
      iconURL: inputUrlVal,
    })
    setMyUserIconUrl(inputUrlVal)
    toast.success(`アイコンを設定しました。`);
  }

  useEffect(
    () => {
      initIcon()
    }, []
  )

  return(
    <Modal 
       className="userSettingModal"
       overlayClassName="userSettingModalOverlay"
       isOpen={props.isModalOpen}>

      <button className='userSettingModalCloseBtn' onClick={() => props.setIsModalOpen(false)}>
        設定変更画面を閉じる
      </button>

      <div className='iconUrl'>
        <h3>アイコン画像</h3>

        <input type='text' className='inputUrl' 
          placeholder='画像URLを入れてください。(https://xxxxxxx)' 
          defaultValue={myUserIconUrl}
          ref={inputUrl}
        />

        <input type="button" onClick={clickFromGoogleIcon}
          className='fromGoogleIconBtn'
          value='Googleのユーザーアイコンを設定'
        />

        <input type="button" onClick={clickSubmitUrl} className='submitUrl' value="submit" />
      </div>
    </Modal>
  )
}

export default UserSettingModal
