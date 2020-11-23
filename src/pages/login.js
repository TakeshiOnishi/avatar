import React from "react"
import Layout from "../components/layout"

import 'firebaseui/dist/firebaseui.css'

const LoginPage = () => (
  <Layout>
    <h1>ログインページ</h1>
    <div className="js-firebaseAuth"></div>
  </Layout>
)

export default LoginPage
