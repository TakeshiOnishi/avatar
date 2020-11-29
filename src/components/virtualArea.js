import React, { useState, useEffect } from "react"
import firebase from "firebase/app"
import 'firebase/auth'
import 'firebase/database'
import UserIcon from "./userIcon.js"
import ChatBox from "../components/ChatBox"

const VirtualArea = () => {
  let spaceName = 'user'
  let database = firebase.database()

  const [userIdList, setUserIdList] = useState([])
  const [userPositions, setUserPositions] = useState({})

  database.ref(spaceName).on("child_removed", data => {
    const fbVal = data.val();
    setUserIdList(current => {
      return current.filter(elm => {
        return elm !== fbVal.id;
      });
    })
  })

  useEffect(
    () => {
      database.ref(spaceName).on("child_added", data => {
        const fbVal = data.val();
        setUserIdList(current => [...current, fbVal.id])
      })
    }, [spaceName, database]
  )

  return(
    <>
      <ChatBox userPositions={userPositions} />
      <div className="virtualArea">
        {userIdList.map(userId => 
          <UserIcon key={userId} id={userId} setUserPositions={setUserPositions}  />
        )}
      </div>
    </>
  )
}

export default VirtualArea
