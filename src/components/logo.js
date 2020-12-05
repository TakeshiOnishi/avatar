import React from "react"
import IconSquare from "../images/logo_horizontal.png"
import EntranceControl from "./entranceControl"

const Logo = () => {
  return(
    <div className='logo' style={{
      backgroundColor: '#FFF',
      display: 'inline-block',
      padding: '16px 24px',
      position: 'absolute',
      top: '32px',
      left: '32px',
      borderRadius: '4px',
      boxShadow: '0px 1px 4px rgba(0,0,0,0.24)',
    }}>
      <img src={IconSquare} style={{
        width: '200px',
        marginRight: '24px',
        verticalAlign: 'top',
        } }/>

      <EntranceControl />
    </div>
  )
}


export default Logo
