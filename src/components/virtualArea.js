import React, { useState, useEffect, useContext } from "react"
import UserIcon from "./userIcon.js"
import ChatBox from "../components/ChatBox"
import { AppGlobalContext } from "../components/layout"

const VirtualArea = () => {
  const { firebaseDB, spaceNameForUser } = useContext(AppGlobalContext)
  const [userIdList, setUserIdList] = useState([])
  const [userPositions, setUserPositions] = useState({})

  useEffect(
    () => {
      if(firebaseDB === undefined) { return }
      firebaseDB.ref(spaceNameForUser).on("child_removed", data => {
        const fbVal = data.val();
        setUserIdList(current => {
          return current.filter(elm => {
            return elm !== fbVal.id
          })
        })
      })

      firebaseDB.ref(spaceNameForUser).on("child_added", data => {
        const fbVal = data.val();
        setUserIdList(current => [...current, fbVal.id])
      })
    }, [firebaseDB, spaceNameForUser]
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
