import React from "react"
import { UserStateContext } from "../components/layout"

const MyStatus = () => {

  return(
    <UserStateContext.Consumer>
    {(user) => {
      return(<div>{user.myUserId} - {user.myUserName}</div>)
    }}
    </UserStateContext.Consumer>
  )
}

export default MyStatus
