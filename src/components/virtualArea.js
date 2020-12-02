import React, { useState, useEffect, useContext, createContext } from "react"
import UserIcon from "./userIcon.js"
import ChatBox from "./ChatBox"
import { AppGlobalContext } from "./layout"

export const VirtualAreaContext = createContext()

const VirtualArea = () => {
  const { firebaseDB, spaceNameForUser } = useContext(AppGlobalContext)
  const [userIdList, setUserIdList] = useState([])
  const [userPositions, setUserPositions] = useState({})
  const [userIconWidth] = useState(120)
  const [userIconPadding] = useState(10)

  useEffect(
    () => {
      firebaseDB.ref(spaceNameForUser).on("child_removed", data => {
        const fbKey = data.key
        setUserIdList(current => {
          return current.filter(elm => {
            return elm !== fbKey
          })
        })
      })

      firebaseDB.ref(spaceNameForUser).on("child_added", data => {
        const fbKey = data.key
        setUserIdList(current => [...current, fbKey])
      })
    }, [firebaseDB, spaceNameForUser]
  )

  const areaContextValue = {
    setUserPositions,
    userIconWidth,
    userIconPadding
  }

  return(
    <>
      <VirtualAreaContext.Provider value={areaContextValue}>
        <ChatBox />
        <div className="virtualArea">
          {userIdList.map(userId => 
            <UserIcon key={userId} id={userId}  />
          )}
        </div>
      </VirtualAreaContext.Provider>
    </>
  )
}

export default VirtualArea
