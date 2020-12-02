import React, { useState } from "react"
import Layout from "../components/layout"
import StatusControl from "../components/StatusControl"
import VirtualArea from "../components/virtualArea"
import UserSettingModal from "../components/userSettingModal"
import Logo from "../components/logo"

import "../styles/index.scss"

const IndexPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return(
    <Layout>
      <>
        <Logo />
        <StatusControl isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
        <VirtualArea />
        <UserSettingModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      </>
    </Layout>
  )
}

export default IndexPage
