import React, { useState, useEffect, useContext, createContext } from "react"
import UserIcon from "./userIcon"
import DrawerChat from "./DrawerChat"
import ChatBox from "./ChatBox"
import { AppGlobalContext } from "./layout"

export const VirtualAreaContext = createContext()

const VirtualArea = () => {
  const { firebaseDB, spaceNameForUser } = useContext(AppGlobalContext)
  const [userIdList, setUserIdList] = useState([])
  const [allChatMessageToMeList, setAllChatMessageToMeList] = useState([])
  const [userPositions, setUserPositions] = useState({})
  const [userIconWidth] = useState(48)

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
    }, []
  )

  const areaContextValue = {
    userPositions,
    setUserPositions,
    userIconWidth,
    allChatMessageToMeList,
    setAllChatMessageToMeList,
  }

  return(
    <>
      <VirtualAreaContext.Provider value={areaContextValue}>
        <div style={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          background: ' repeating-linear-gradient(0deg, #DDDBDB 0px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 100px), repeating-linear-gradient(90deg, #DDDBDB 0px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 100px) '
        }}>
          <ChatBox />
          {userIdList.map(userId => 
            <UserIcon key={userId} id={userId} />
          )}
        </div>
        <DrawerChat />
      </VirtualAreaContext.Provider>
    </>
  )
}

export default VirtualArea
