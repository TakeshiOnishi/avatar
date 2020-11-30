import React, { useContext } from "react"
import { AppGlobalContext, rangeSizeMap } from "../components/layout"
import dayjs from "dayjs"
import { toast } from 'react-toastify'

const ChatBox = props => {
  const { 
    myUserId, 
    myRange,
    setMyRange,
    firebaseDB,
    spaceNameForChat
  } = useContext(AppGlobalContext)

  let userPositions = props.userPositions
  const maxTextLength = 80

  const validChatText = textInput => {
    if(textInput.value.length >= maxTextLength) {
      toast.error(`${maxTextLength}文字を超えています。`);
      return false
    }else if(textInput.value.trim() === '') {
      toast.error(`文字を入力してください。`);
      return false
    }else{
      return true
    }
  }
  //chatbox 途中 →  次はnerdの次

  const chatSend = textInput => {
    let nearlyUserIds = []
    let userIconRadius
    if (typeof window !== "undefined") { userIconRadius = document.querySelector(`.userIcon`).clientWidth / 2 }
    let myIconRadius = userIconRadius + rangeSizeMap(myRange)
    let [myPositionCenterX, myPositionCenterY] = 
      [
        userPositions[myUserId]['x'] + userIconRadius,
        userPositions[myUserId]['y'] + userIconRadius,
      ]

    for (let [id, position] of Object.entries(userPositions)) {
      if( id === myUserId) { continue }
      if([0, 1].includes(parseInt(position.statusId))) { continue } // HACK: 会話できないリストを管理
      let [positionCenterX, positionCenterY] = [
          position.x + userIconRadius,
          position.y + userIconRadius,
        ]
      let diffX = (myPositionCenterX - positionCenterX) ** 2
      let diffY = (myPositionCenterY - positionCenterY) ** 2
      let diffR = (myIconRadius + userIconRadius) ** 2
      if(diffX + diffY <= diffR) {
        // HACK: この辺のDOM強引処理を変更
        if (typeof window !== "undefined") {
          document.querySelector(`[data-id="${id}"]`).classList.add('blink')
          setTimeout(() => {
            document.querySelector(`[data-id="${id}"]`).classList.remove('blink')
          }, 2000)
          nearlyUserIds.push(id)
        }
      }
    }
    firebaseDB.ref(`${spaceNameForChat}/${myUserId}`).set({
      message: textInput.value,
      date: dayjs().format('YYYY/MM/DD HH:mm:ss'),
      targetUserIds: nearlyUserIds
    })
    toast.success(`チャットを送信しました。`);
    textInput.value = ''
  }

  const enterCheck = ev => {
    if(ev.which === 13 && validChatText(ev.target) === true) {
      chatSend(ev.target)
    }
  }

  const handleChange = ev => {
    setMyRange(ev.target.value)
  }

  return (
    <div className='chatBox'>
      <select className='rangeSelect' onBlur={handleChange} 
        onChange={handleChange} defaultValue={myRange} 
      >
        <option value='L'>大</option>
        <option value='M'>中</option>
        <option value='S'>小</option>
      </select>

      <input type='text' className='textInput' 
        onKeyPress={enterCheck} 
        placeholder={`チャット内容 ${maxTextLength}文字まで (ENTERで送信)`}
      />

    </div>
  )
}

export default ChatBox
