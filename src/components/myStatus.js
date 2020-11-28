import React from "react"
import { UserStateContext } from "../components/layout"

const MyStatus = () => {

  return(
    <UserStateContext.Consumer>
    {(user) => {
      return(<div>{user.myUserId} - {user.myUserName} - {user.myRangeSelect}</div>)
    }}
    </UserStateContext.Consumer>
  )
}

export default MyStatus

// ステータス構想
// firebaseに↓  のようなチャンネル作る
// userStatus だけ管理 (state: userStatusList
//     - セットしたりするのに楽だから layout ContextにもmyUserStatusId, myUserStatusLabelも用意
//        - watchはUserIconで行う
//     - { 'gi3kg8': { status: '話しかけるなID', label: 'ラベル' } }
//     - status, 1: 無理, 2: OK, 3: むしろ話しかけてくれ, それ以外は退出
//     - labelはフリー入力させる (プルダウンで更に選ばせる)
//     - というか、 ステータス選択と横にラベル入力でいい (ラベル入力はプルダウンのデフォ値使う)
// userIcon だけ管理 (state: userIconList
//     - これはGravatorの次の作業時
