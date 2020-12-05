import React, { useState, useEffect, useContext } from "react"
import { AppGlobalContext, statusIdToString, statusIdToColorCode } from "./layout"
import { toast } from 'react-toastify';
import { Grid, Button, Select, MenuItem, Avatar, Badge } from '@material-ui/core'
import { brown } from '@material-ui/core/colors'

const EntranceControl = props => {
  const { 
    myUserId, 
    myUserName,
    firebaseDB,
    spaceNameForUser,
  } = useContext(AppGlobalContext)

  const joinRoom = (isAtHome) => {
    firebaseDB.ref(`${spaceNameForUser}/${myUserId}`).set({
      id: myUserId,
      name: myUserName,
      isAtHome: isAtHome,
      x: window.innerWidth / 2  | 0,
      y: window.innerHeight / 2  | 0,
    })
    toast.success(`部屋に入室しました。`);
  }

  const outRoom = () => {
    firebaseDB.ref(`${spaceNameForUser}/${myUserId}`).remove()
    toast.success(`部屋から退室しました。`);
  }

  return (
    <>
      <Button variant="outlined" style={{marginRight: '8px'}} onClick={() => {joinRoom(1)}}>入室(在宅)</Button>
      <Button variant="outlined" style={{marginRight: '8px'}} onClick={() => {joinRoom(0)}}>入室(出社)</Button>
      <Button variant="outlined" onClick={outRoom}>退出</Button>
    </>

  )
}
export default EntranceControl
