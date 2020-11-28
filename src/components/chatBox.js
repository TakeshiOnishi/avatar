import React, { useContext } from "react"
import { UserStateContext, rangeSizeMap } from "../components/layout"
import dayjs from "dayjs"
import firebase from "firebase/app"
import 'firebase/auth'
import 'firebase/database'

// HACK: querySelectorでDOMを強引に取得してる処理を修正

const ChatBox = props => {
  const { myUserId, myRangeSelect, setMyRangeSelect } = useContext(UserStateContext)
  const maxTextLength = 80
  let spaceName = 'chat'
  let userPositions = props.userPositions
  let database = firebase.database()
    // HACK: SSRでwindow無いエラーになるので一旦むりやり
  let rangeSelect
  let submitBtn
  let textInput
  let errElm
  if (typeof window !== "undefined") {
    rangeSelect = document.querySelector('.chatBox .rangeSelect')
    submitBtn = document.querySelector('.chatBox .submit')
    textInput = document.querySelector('.chatBox .textInput')
    errElm = document.querySelector('.chatBox .err')
  }

  const chatSend = () => {
    if(textInput.value.length >= maxTextLength) {
      errElm.innerHTML = `${maxTextLength}文字を超えています。`
      setTimeout(() => {
        errElm.innerHTML = ''
      }, 2000)
      return
    }else if(textInput.value.trim() === '') {
      errElm.innerHTML = `文字を入力してください。`
      setTimeout(() => {
        errElm.innerHTML = ''
      }, 2000)
      return
    }

    let nearlyUserIds = []
    let userIconRadius
    if (typeof window !== "undefined") {
      userIconRadius = document.querySelector(`.userIcon`).clientWidth / 2
    }
    let myIconRadius = userIconRadius + rangeSizeMap(myRangeSelect)
    let [myPositionCenterX, myPositionCenterY] = 
      [
        userPositions[myUserId]['x'] + userIconRadius,
        userPositions[myUserId]['y'] + userIconRadius,
      ]

    for (let [id, position] of Object.entries(userPositions)) {
      if( id === myUserId) { continue }
      let [positionCenterX, positionCenterY] = [
          position.x + userIconRadius,
          position.y + userIconRadius,
        ]
      let diffX = (myPositionCenterX - positionCenterX) ** 2
      let diffY = (myPositionCenterY - positionCenterY) ** 2
      let diffR = (myIconRadius + userIconRadius) ** 2
      if(diffX + diffY <= diffR) {
        // HACK: この辺の強引処理を変更
        if (typeof window !== "undefined") {
          document.querySelector(`[data-id="${id}"]`).classList.add('blink')
          setTimeout(() => {
            document.querySelector(`[data-id="${id}"]`).classList.remove('blink')
          }, 2000)
          nearlyUserIds.push(id)
        }
      }
    }
    database.ref(`${spaceName}/${myUserId}`).set({
      message: textInput.value,
      date: dayjs().format('YYYY/MM/DD HH:mm:ss'),
      targetUserIds: nearlyUserIds
    })

    textInput.value = ''
  }

  const handleKeyUp = ev => {
    if(ev.which === 13) {
      submitBtn.click()
    }
  }

  const handleChange = () => setMyRangeSelect(rangeSelect.value)

  return (
    <div className='chatBox'>
      <select className='rangeSelect' onBlur={handleChange} onChange={handleChange} defaultValue={myRangeSelect} name='rangeSelect'>
        <option value='L'>大</option>
        <option value='M'>中</option>
        <option value='S'>小</option>
      </select>
      <input type='text' className='textInput' onKeyPress={handleKeyUp} placeholder={`チャット内容 ${maxTextLength}文字まで`} />
      <input type='button' className='submit' onClick={chatSend} value='送信' />
      <p className='err'></p>
    </div>
  )
}

export default ChatBox
