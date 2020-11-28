import React from "react"
import Layout from "../components/layout"
import MyStatus from "../components/myStatus"
import StatusControl from "../components/StatusControl"
import VirtualArea from "../components/virtualArea"

import "../styles/index.scss"

const IndexPage = () => {
  return(
    <Layout>
      <>
        <MyStatus />
        <StatusControl />
        <VirtualArea />
      </>
    </Layout>
  )
}

export default IndexPage
