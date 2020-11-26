import React, { useState, createContext, useEffect } from "react"
import { UserStateContext } from "../components/layout"
import firebase from "firebase/app"
import 'firebase/auth'
import 'firebase/database'
import UserIcon from "./userIcon.js"

const VirtualArea = () => {
  let spaceName = 'user'
  let database = firebase.database()

  const [userList, setUserList] = useState([])

  const modifyUserIcon = targetUserObj => {
    setUserList(current => {
      return current.map(user => {
        if (user.id == targetUserObj.id) {
          database.ref(`${spaceName}/${targetUserObj.id}`).set(targetUserObj)
          return targetUserObj
        }
        return user
      })
    })
  }

  // HACK: effectのタイミング調整 現在過度に発火
  database.ref(spaceName).on("child_removed", data => {
    const fbVal = data.val();
    setUserList(current => {
      return current.filter((el) => {
        return el.id != fbVal.id;
      });
    })
  })

  useEffect(
    () => {
      database.ref(spaceName).on("child_added", data => {
        const fbVal = data.val();
        const fbKey = data.key;
        setUserList(current => [...current, {id:fbVal.id, name: fbVal.name, x:fbVal.x, y:fbVal.y}])
      })
    }, []
  )

  // FIXME: for Debug
  // useEffect(
    // () => {
      // console.log(userList)
    // }, [userList]
  // )


  return(
    <>
      <div className="virtualArea">
        {userList.map(user => 
          <UserIcon key={user.id} modifyUserIcon={modifyUserIcon} attribute={{id: user.id, name: user.name, x:user.x, y:user.y}} />
        )}
      </div>
    </>
  )
}

export default VirtualArea
