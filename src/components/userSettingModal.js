import React, { useState, useEffect, useContext, useRef } from "react"
import { AppGlobalContext } from "./layout"
import "../styles/layout.scss"
import Modal from "react-modal"
import { Grid, Button, TextField } from '@material-ui/core'
import { toast } from 'react-toastify'
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { brown } from '@material-ui/core/colors'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"

const UserSettingModal = props => {
  Modal.setAppElement('body')

  const inputIconUrl = useRef()

  const { 
    myUserId, 
    myUserIconUrl, 
    myGoogleIconUrl,
    setMyUserIconUrl,
    firebaseDB,
    spaceNameForUserSetting,
  } = useContext(AppGlobalContext)

  const clickFromGoogleIcon = ev => {
    inputIconUrl.current.querySelector('input').value = myGoogleIconUrl
  }

  const initIcon = () => {
    firebaseDB.ref(`${spaceNameForUserSetting}/${myUserId}`).once('value', data => {
      const fbVal = data.val()
      if(fbVal !== null) {
        setMyUserIconUrl(fbVal.iconURL)
      }
    })
  }

  const clickSave = ev => {
    let inputIconUrlVal = inputIconUrl.current.querySelector('input').value
    firebaseDB.ref(`${spaceNameForUserSetting}/${myUserId}`).set({
      iconURL: inputIconUrlVal,
    })
    setMyUserIconUrl(inputIconUrlVal)
    toast.success(`アイコンを設定しました。`)
    props.setIsModalOpen(false)
  }

  const theme = createMuiTheme({
    palette: {
      primary: brown,
    },
  })

  useEffect(
    () => {
      initIcon()
    }, []
  )

  return(
    <Modal 
      className="userSettingModal"
      overlayClassName="userSettingModalOverlay"
      isOpen={props.isModalOpen}
    >
      <ThemeProvider theme={theme}>
        <FontAwesomeIcon icon={faTimes} style={{fontSize: '1.2rem', position: 'absolute', right: '50px', top: '50px', cursor: 'pointer'}} onClick={() => props.setIsModalOpen(false)} />

        <Grid container spacing={1} alignItems="flex-end" style={{marginTop: '20px'}}>
          <h4 style={{textAlign: 'center', marginBottom: '10px'}}>プロフィール画像を設定</h4>
          <TextField label='画像URLを入れてください。(https://xxxxxxx)' 
            defaultValue={myUserIconUrl}
            ref={inputIconUrl}
            style={{width: '100%'}}
          />
          <Button variant="contained" style={{margin: '10px 0'}} onClick={clickFromGoogleIcon}>Googleのユーザーアイコンを設定</Button>
        </Grid>

        <Button variant="contained" color="primary" onClick={clickSave} style={{
          position: 'inherit',
          right: '50px',
          bottom: '50px',
          padding: '15px 40px',
        }}>保存</Button>
      </ThemeProvider>
    </Modal>
  )
}

export default UserSettingModal
