import React, { useState, useEffect, useContext } from "react"
import { AppGlobalContext, statusIdToString } from "../components/layout"
import dayjs from "dayjs"
import firebase from "firebase/app"
import 'firebase/auth'
import 'firebase/database'
import "../styles/layout.scss"
import Modal from "react-modal"
import { toast } from 'react-toastify'

const UserSettingModal = props => {
  let database = firebase.database()
  Modal.setAppElement('body')
  const { myUserId, myUserIconUrl, setMyUserIconUrl, myGoogleIconUrl } = useContext(AppGlobalContext)

  const handleClickFromGoogleIcon = ev => {
    ev.target.parentNode.querySelector('.inputUrl').value = myGoogleIconUrl
  }

  const handleClickSubmitUrl = ev => {
    let userSettingSpaceName = 'user_setting' // TODO: この辺の変数名をglobal化

    let inputUrlVal = ev.target.parentNode.querySelector('.inputUrl').value
    database.ref(`${userSettingSpaceName}/${myUserId}`).set({
      iconURL: inputUrlVal,
      date: dayjs().format('YYYY/MM/DD HH:mm:ss')
    })
    setMyUserIconUrl(inputUrlVal)
    toast.success(`アイコンを設定しました。`);
  }

  return(
    <Modal 
       className="userSettingModal"
       overlayClassName="userSettingModalOverlay"
       isOpen={props.isModalOpen}>

      <button className='userSettingModalCloseBtn' onClick={() => props.setIsModalOpen(false)}>設定変更画面を閉じる</button>

      <div className='iconUrl'>
        <h3>アイコン画像</h3>
        <input type='text' className='inputUrl' placeholder='画像URLを入れてください。(https://xxxxxxx)' defaultValue={myUserIconUrl} />
        <input type="button" onClick={handleClickFromGoogleIcon} className='fromGoogleIconBtn' value='Googleのユーザーアイコンを設定' />
        <input type="button" onClick={handleClickSubmitUrl} className='submitUrl' value="submit" />
      </div>
    </Modal>
  )
}

export default UserSettingModal
