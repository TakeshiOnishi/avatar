import React from "react"
import firebase from "firebase/app"
import 'firebase/auth'
import 'firebase/database'

const ChatBox = (props) => {
  const maxTextLength = 80
  let spaceName = 'chat'
  let database = firebase.database()
  let myUserId = props.userState.myUserId
  let rangeSelect = document.querySelector('.chatBox .rangeSelect')
  let submitBtn = document.querySelector('.chatBox .submit')
  let textInput = document.querySelector('.chatBox .textInput')
  let errElm = document.querySelector('.chatBox .err')

  const chatSend = () => {
    if(textInput.value.length >= maxTextLength) {
      errElm.innerHTML = `${maxTextLength}文字を超えています。`
      setTimeout(() => {
        errElm.innerHTML = ''
      }, 2000)
      return
    }

    let now = new Date();
    database.ref(`${spaceName}/${myUserId}`).set({
      size: rangeSelect.value,
      message: textInput.value,
      date: now.getTime(),
    })

    textInput.value = ''
  }

  const handleKeyUp = ev => {
    if(ev.keyCode === 13) {
      submitBtn.click()
    }
  }

  return(
    <div className='chatBox'>
      <select className='rangeSelect' name='rangeSelect'>
        <option value='l'>大</option>
        <option value='m'>中</option>
        <option value='s'>小</option>
      </select>
      <input type='text' className='textInput' onKeyUp={handleKeyUp} placeholder={`チャット内容 ${maxTextLength}文字まで`} />
      <input type='button' className='submit' onClick={chatSend} value='送信' />
      <p className='err'></p>
    </div>
  )
}

export default ChatBox
