import React, { useState, useEffect, useContext } from "react"
import { AppGlobalContext, statusIdToString, statusIdToColorCode, moodScoreToIcon } from "./layout"
import { toast } from 'react-toastify';
import { Grid, Button, Select, MenuItem, Avatar, Badge } from '@material-ui/core'
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { brown } from '@material-ui/core/colors'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

let KeyboardEventHandler
if (typeof window !== "undefined") {
  KeyboardEventHandler = require('react-keyboard-event-handler')
}

const StatusControl = props => {
  const { 
    myUserId, 
    myUserName,
    myUserIconUrl,
    setMyUserStatusId,
    myMood,
    setMyMood,
    myJoinState,
    firebaseDB,
    spaceNameForUser,
    spaceNameForStatus,
    spaceNameForUserMood,
  } = useContext(AppGlobalContext)

  let [statusId, setStatusId] = useState(0)

  const handleStatusChange = ev => {
    let statusId = ev.target.value
    updateStatus(statusId)
  }
  const updateStatus = statusId => {
    if(![0,1,2,3].includes(statusId)){ return } // OPTIMIZE: 簡易valid
    firebaseDB.ref(`${spaceNameForStatus}/${myUserId}`).set({
      statusId: statusId
    })
    setStatusId(statusId)
    toast.success(`ステータスを更新しました。`)
  }

  const moodSelectChange = ev => {
    firebaseDB.ref(`${spaceNameForUserMood}/${myUserId}`).set({
      moodScore: ev.target.value,
    })
    setMyMood(ev.target.value)
  }

  const initStatus = () => {
    firebaseDB.ref(`${spaceNameForStatus}/${myUserId}`).once('value', data => {
      const fbVal = data.val()
      if(fbVal !== null) {
        setStatusId(fbVal.statusId)
      }
    })
    firebaseDB.ref(`${spaceNameForUserMood}/${myUserId}`).once('value', data => {
      const fbVal = data.val()
      if(fbVal !== null) {
        setMyMood(fbVal.moodScore)
      }
    })
  }

  const theme = createMuiTheme({
    palette: {
      primary: brown,
    },
  })

  const triggerKeyBind = ev =>{
    switch(ev) {
      case 'ctrl+0': updateStatus(0); break;
      case 'ctrl+1': updateStatus(1); break;
      case 'ctrl+2': updateStatus(2); break;
      case 'ctrl+3': updateStatus(3); break;
      default: break;
    }
  }

  useEffect(
    () => {
      initStatus()
    }, []
  )

  return(
    <>
      {myJoinState === true && <>
        <KeyboardEventHandler 
          handleKeys={['ctrl+0', 'ctrl+1', 'ctrl+2', 'ctrl+3']}
          onKeyEvent={triggerKeyBind}
          handleFocusableElements={true}
        />
        <ThemeProvider theme={theme}>
          <div className='statusControl' style={{
            backgroundColor: '#FFF',
            padding: '14px 24px',
            position: 'absolute',
            top: '32px',
            right: '32px',
            borderRadius: '4px',
            boxShadow: '0px 1px 4px rgba(0,0,0,0.24)',
          }}>

            <Grid container style={{
              display: 'flex',
              alignItems: 'center',
            }}>
              <Grid item>
               <Select value={statusId} onBlur={null} onChange={handleStatusChange} style={{height: '40px', marginRight: '24px'}}>
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
                      {statusIdToString(id)} <span style={{textSize: '0.6rem', color: '#CCC', paddingLeft: '0.3rem'}}>(ctrl+{id})</span>
                    </MenuItem>
                  )}
                </Select>
              </Grid>

              <Grid item>
                <Select value={myMood} onBlur={null} onChange={moodSelectChange} style={{marginRight: '24px', padding: '0 5px'}}>
                  {[2,1,0,-1,-2].map((score, index) => 
                    <MenuItem key={index} value={score}>
                      <FontAwesomeIcon icon={moodScoreToIcon(score)} style={{fontSize: '24px'}} />
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
                  badgeContent={<FontAwesomeIcon icon={moodScoreToIcon(myMood)} style={{fontSize: '1.3rem', background: '#FFF', color: '#715246', borderRadius: '50%'}} />}
                >
                  <Avatar alt={myUserName} src={myUserIconUrl} style={{
                      border: '4px double',
                      borderColor: statusIdToColorCode(statusId),
                      width: '32px',
                      height: '32px',
                      cursor: 'pointer',
                    }} 
                    className={statusId === 3 ? 'rainbowC' : '' }
                    onClick={() => props.setIsModalOpen(true)}
                  />
                </Badge>
              </Grid>
            </Grid>
          </div>
        </ThemeProvider>
      </>
      }
    </>
  )
}

export default StatusControl
