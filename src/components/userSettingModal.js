import React, { useEffect, useContext, useRef } from "react"
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

  let inputUrl = useRef()

  const { 
    myUserId, 
    myUserIconUrl, 
    setMyUserIconUrl, 
    myGoogleIconUrl,
    firebaseDB,
    spaceNameForUserSetting,
  } = useContext(AppGlobalContext)

  const clickFromGoogleIcon = ev => {
    inputUrl.current.querySelector('input').value = myGoogleIconUrl
  }

  const initIcon = () => {
    firebaseDB.ref(`${spaceNameForUserSetting}/${myUserId}`).once('value', data => {
      const fbVal = data.val()
      if(fbVal !== null) {
        setMyUserIconUrl(fbVal.iconURL)
      }
    })
  }

  const clickSubmitUrl = ev => {
    let inputUrlVal = inputUrl.current.querySelector('input').value
    firebaseDB.ref(`${spaceNameForUserSetting}/${myUserId}`).set({
      iconURL: inputUrlVal,
    })
    setMyUserIconUrl(inputUrlVal)
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

        <h4 style={{textAlign: 'center'}}>プロフィール画像を設定する</h4>
        <TextField label='画像URLを入れてください。(https://xxxxxxx)' 
          defaultValue={myUserIconUrl}
          ref={inputUrl}
          style={{width: '100%'}}
        />

        <Grid container spacing={1} alignItems="flex-end" style={{marginTop: '20px'}}>
          <Grid item>
            <Button variant="contained" style={{marginRight: '5px'}} onClick={clickFromGoogleIcon}>Googleのユーザーアイコンを設定</Button>
          </Grid>

          <Grid item>
            <Button variant="contained" color="primary" onClick={clickSubmitUrl}>画像URLをアイコンとして登録する</Button>
          </Grid>
        </Grid>
      </ThemeProvider>
    </Modal>
  )
}

export default UserSettingModal
