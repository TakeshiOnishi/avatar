import React from "react"
import Layout from "../components/layout"

import 'firebaseui/dist/firebaseui.css'
import IconSquareGif from "../images/icon.gif"

const LoginPage = () => (
  <Layout>
    <div style={{ width: '400px', margin: '0 auto', position: 'relative'}}>
      <img src={IconSquareGif} width='100%' />
      <div className="js-firebaseAuth" style={{textAlign: 'center'}}></div>
    </div>
  </Layout>
)

export default LoginPage
