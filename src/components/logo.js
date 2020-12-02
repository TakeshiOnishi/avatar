import React from "react"
import IconSquare from "../images/icon_small.jpg"

const Logo = () => {
  return(
    <div className='logo' style={{
      position: 'absolute',
      width: '50px',
      height: '50px',
      top: '50px',
      left: '50px',
    }}>
    <img src={IconSquare} style={{width: '100%'} }/>
    </div>
  )
}


export default Logo
