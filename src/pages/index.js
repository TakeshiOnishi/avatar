import React, { useState, createContext } from "react"
import Layout from "../components/layout"
import MyStatus from "../components/myStatus"
import StatusControl from "../components/StatusControl"
import ChatBox from "../components/ChatBox"
import VirtualArea from "../components/virtualArea"
import { UserStateContext } from "../components/layout"

import "../styles/index.scss"

const IndexPage = () => {
  return(
    <Layout>
      <UserStateContext.Consumer>
        {(userState) => {
          return (
            <>
              <MyStatus />
              <StatusControl />
              <ChatBox userState={userState} />
              <VirtualArea />
            </>
          )
        }}
      </UserStateContext.Consumer>
    </Layout>
  )
}

export default IndexPage
