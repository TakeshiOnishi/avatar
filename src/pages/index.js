import React, { useState } from "react"
import Layout from "../components/layout"
import StatusControl from "../components/StatusControl"
import VirtualArea from "../components/virtualArea"
import UserSettingModal from "../components/userSettingModal"

import "../styles/index.scss"

const IndexPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return(
    <Layout>
      <>
        <button onClick={() => setIsModalOpen(true)} className='userSettingModalOpenBtn'>ユーザー設定変更</button>
        <StatusControl />
        <VirtualArea />
        <UserSettingModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      </>
    </Layout>
  )
}

export default IndexPage
