import React, { useState, createContext } from "react"
import { UserStateContext } from "../components/layout"
import firebase from "firebase/app"
import 'firebase/auth'
import 'firebase/database'
import UserIcon from "./userIcon.js"

const VirtualArea = () => {
  let spaceName = 'user'
  let database = firebase.database()

  const [userList, setUserList] = useState([])

  database.ref(spaceName).on("child_removed", function(data) {
    const fbVal = data.val();

    let newUserList = [...userList]
    newUserList.some(function(v, i){
      if (v.id == fbVal.id) newUserList.splice(i,1)
    })
    setUserList(newUserList)
    console.log(userList)
  })

  database.ref(spaceName).on("child_added", function(data) {
    const fbVal = data.val();

    // LocalCreate
    if(!userList.some(user => user.id == data.key)){
      let newUserList = [...userList, {id:fbVal.id, name: fbVal.name, x:fbVal.x, y:fbVal.y}]
      setUserList(newUserList)
    }
  })

  database.ref(spaceName).on("child_changed", function(data) {
    const fbVal = data.val();

    // LocalChanged
    if(userList.some(user => user.id == data.key)){
      let newUserList = userList.map((user, index) => {
        if(user.id == data.key) {
          return {id:user.id, name: user.name, x:fbVal.x, y: fbVal.y}
        }else{
          return {id:user.id, name: user.name, x:user.x, y: user.y}
        }
      });
      setUserList(newUserList)
    }
  })

  return(
    <>
      <div className="virtualArea">
        {userList.map(user => 
          <UserIcon key={user.id} attribute={{id: user.id, name: user.name, x:user.x, y:user.y}} />
        )}
      </div>
    </>
  )
}

export default VirtualArea
