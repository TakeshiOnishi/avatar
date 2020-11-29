import React from "react"
import Layout from "../components/layout"
import StatusControl from "../components/StatusControl"
import VirtualArea from "../components/virtualArea"

import "../styles/index.scss"

const IndexPage = () => {
  return(
    <Layout>
      <>
        <StatusControl />
        <VirtualArea />
      </>
    </Layout>
  )
}

export default IndexPage
