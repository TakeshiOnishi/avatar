import React, { useContext, useState } from "react"
import { AppGlobalContext, rangeSizeMap } from "./layout"
import { VirtualAreaContext } from "./virtualArea"
import { Drawer, Button, Avatar, List, ListItem, ListItemText, ListItemAvatar, Divider } from '@material-ui/core'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHistory } from "@fortawesome/free-solid-svg-icons"
import { faTimes } from "@fortawesome/free-solid-svg-icons"

const DrawerChat = () => {
  const { 
    myUserId, 
    myUserName,
    firebaseDB,
    spaceNameForChat
  } = useContext(AppGlobalContext)
  const { 
    allChatMessageToMeList,
  } = useContext(VirtualAreaContext)

  const [isOpen, setIsOpen] = React.useState(false)

  const closeDrawerKey = (event) => {
    console.log('hoge')
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }
    setIsOpen(false)
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} style={{
        position: 'absolute', 
        bottom: '160px', 
        right: '32px',
        backgroundColor: '#ffffff',
        borderRadius: '4px',
        boxShadow: '0px 1px 4px rgba(0,0,0,0.24)',
        padding: '16px 24px',
      }}>
        <FontAwesomeIcon icon={faHistory} style={{fontSize: '16px', marginRight: '5px'}} />チャット履歴
      </Button>
      <Drawer anchor='right' open={isOpen} onClose={closeDrawerKey}>
        <div style={{
            width: 250,
            padding: 15,
        }}>
          <div>
            <FontAwesomeIcon icon={faTimes} style={{
              fontSize: '16px', position: 'absolute', top: '30px', right: '30px', cursor: 'pointer'
              }} onClick={() => setIsOpen(false)}
            />
          </div>
          <div style={{marginTop: '60px', }}>
            <h4 style={{textAlign: 'center'}}>チャット履歴</h4>
            <List>
              {allChatMessageToMeList.reverse().map((chatObj, index) =>
                <div key={index}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt={chatObj.name} src={chatObj.iconUrl} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={chatObj.name}
                      secondary={
                        <>
                          <span style={{margin: '.25rem 0', display: 'block'}}>{chatObj.message}</span>
                          <span style={{
                             fontSize: '0.4rem',
                             fontStyle: 'italic',
                             textAlign: 'right',
                             display: 'block',
                          }}>{chatObj.date}</span>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider />
                </div>
              )}
            </List>
          </div>
        </div>
      </Drawer>
    </>
  )
}

export default DrawerChat
