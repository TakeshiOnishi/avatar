import React, { useState, useEffect, useContext } from "react"
import { AppGlobalContext, statusIdToString, statusIdToColorCode } from "./layout"
import { toast } from 'react-toastify';
import { Grid, Button, Select, MenuItem, Avatar, Badge } from '@material-ui/core'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCloudShowersHeavy } from "@fortawesome/free-solid-svg-icons"
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { brown } from '@material-ui/core/colors'

const StatusControl = props => {
  const { 
    myUserId, 
    myUserName,
    myUserIconUrl,
    setMyUserStatusId,
    firebaseDB,
    spaceNameForUser,
    spaceNameForStatus,
  } = useContext(AppGlobalContext)

  let [statusId, setStatusId] = useState(0)

  const joinRoom = (myUserId, myUserName) => {
    firebaseDB.ref(`${spaceNameForUser}/${myUserId}`).set({
      id: myUserId,
      name: myUserName,
      x: 0,
      y: 0,
    })
    toast.success(`部屋に参加しました。`);
  }

  const outRoom = (myUserId) => {
    firebaseDB.ref(`${spaceNameForUser}/${myUserId}`).remove()
    toast.success(`部屋から退室しました。`);
  }

  const handleStatusChange = ev => {
    let statusId = ev.target.value //HACK: validCheck
    firebaseDB.ref(`${spaceNameForStatus}/${myUserId}`).set({
      statusId: statusId
    })
    setStatusId(ev.target.value)
    toast.success(`ステータスを更新しました。`)
  }

  const initStatus = () => {
    firebaseDB.ref(`${spaceNameForStatus}/${myUserId}`).once('value', data => {
      const fbVal = data.val()
      if(fbVal !== null) {
        setStatusId(fbVal.statusId)
      }
    })
  }

  const theme = createMuiTheme({
    palette: {
      primary: brown,
    },
  })

  useEffect(
    () => {
      initStatus()
    }, []
  )

  return(
    <>
      <AppGlobalContext.Consumer>
      {(user) => {
        return (
          <ThemeProvider theme={theme}>
            <div className='statusControl' style={{
              position: 'absolute',
              top: '30px',
              right: '30px',
            }}>

              <Grid container spacing={3} alignItems="flex-end">
                <Grid item>
                  <Button variant="outlined" style={{marginRight: '5px'}} onClick={() => props.setIsModalOpen(true)}>ユーザー設定変更</Button>
                </Grid>

                <Grid item>
                  <Button variant="outlined" style={{marginRight: '5px'}} onClick={() => {joinRoom(user.myUserId, user.myUserName)}}>部屋に参加</Button>
                  <Button variant="outlined" style={{marginRight: '5px'}} onClick={() => {outRoom(user.myUserId)}}>部屋から退出</Button>
                </Grid>

                <Grid item>
                  <Select value={statusId} onBlur={null} onChange={handleStatusChange} style={{height: '40px', marginRight: '10px'}}>
                    {[0,1,2,3].map(id => 
                      <MenuItem key={id} value={id}>
                        <span style={{ 
                          width: '8px',
                          height: '8px',
                          margin: '8px',
                          background: statusIdToColorCode(id) ,
                          borderRadius: '8px',
                          display: 'inline-block',
                          verticalAlign: 'middle',
                        }}></span>
                        {statusIdToString(id)}
                      </MenuItem>
                    )}
                  </Select>
                </Grid>

                <Grid item>
                  <Badge
                    overlap="circle"
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    badgeContent={<FontAwesomeIcon icon={faCloudShowersHeavy} style={{fontSize: '1.2rem'}} />}
                  >
                    <Avatar alt={myUserName} src={myUserIconUrl} style={{
                        border: '5px double',
                        borderColor: statusIdToColorCode(statusId),
                      }} 
                      className={statusId === 3 ? 'rainbowC' : '' }
                    />
                  </Badge>
                </Grid>
              </Grid>
            </div>
          </ThemeProvider>
        )
      }}
      </AppGlobalContext.Consumer>
    </>
  )
}

export default StatusControl
