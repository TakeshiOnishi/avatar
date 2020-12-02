import React, { useContext } from "react"
import { AppGlobalContext, rangeSizeMap } from "./layout"
import { VirtualAreaContext } from "./virtualArea"
import dayjs from "dayjs"
import { toast } from 'react-toastify'

const ChatBox = props => {
  const { 
    myUserId, 
    myUserName,
    myRange,
    setMyRange,
    firebaseDB,
    spaceNameForChat
  } = useContext(AppGlobalContext)
  const { userPositions, userIconWidth } = useContext(VirtualAreaContext)

  const maxTextLength = 80
  const chatRangePixelAdjust = (userIconWidth / 2 ) * 0.1 | 0

  const validChatText = textInput => {
    if(textInput.value.length >= maxTextLength) {
      toast.error(`${maxTextLength}文字を超えています。`);
    }else if(textInput.value.trim() === '') {
      toast.error(`文字を入力してください。`);
    }else{
      return true
    }
  }

  const chatSend = textInput => {
    let nearlyUserIds = []
    let myIconPositionInfo = getMyIconPositionInfo(userPositions[myUserId]['x'], userPositions[myUserId]['y'])

    for (let [id, position] of Object.entries(userPositions)) {
      if( id === myUserId) { continue }
      if([0, 1].includes(parseInt(position.statusId))) { continue } // HACK: 会話できないリストを管理
      if(checkHit(myIconPositionInfo, getIconPositionInfo(position.x, position.y)) === true) {
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
    if(nearlyUserIds.length >= 1) {
      firebaseDB.ref(`${spaceNameForChat}/${myUserId}`).set({
        message: textInput.value,
        name: myUserName,
        date: dayjs().format('YYYY/MM/DD HH:mm:ss'),
        targetUserIds: nearlyUserIds
      })
      toast.success(`チャットを送信しました。`);
      textInput.value = ''
    }else{
      toast.warning(`範囲内にチャット送信対象がいませんでした。`);
    }
  }

  const getIconPositionInfo = (positionX, positionY) => {
    return {
      x: positionX + userIconWidth/2,
      y: positionY + userIconWidth/2,
      r: userIconWidth/2,
    }
  }

  const getMyIconPositionInfo = (positionX, positionY) => {
    let myIconPositionInfo = getIconPositionInfo(positionX, positionY)
    myIconPositionInfo.r += rangeSizeMap(myRange)
    return myIconPositionInfo
  }

  const checkHit = (objA, objB) => {
    let diffX = (objA.x - objB.x) ** 2
    let diffY = (objA.y - objB.y) ** 2
    let diffR = (objA.r + objB.r - chatRangePixelAdjust) ** 2
    if(diffX + diffY < diffR) {
      return true
    }
  }

  const enterCheck = ev => {
    if(ev.which === 13 && validChatText(ev.target) === true) {
      chatSend(ev.target)
    }
  }

  const rangeSelectChange = ev => {
    setMyRange(ev.target.value)
  }

  return (
    <div className='chatBox'>
      <select className='rangeSelect' onBlur={null} onChange={rangeSelectChange} defaultValue={myRange}>
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
