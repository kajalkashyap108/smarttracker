//import { Color } from '@chakra-ui/react'
import React from 'react'

export default function Navbar() {
  return (
    <div style={{display:"Flex", justifyContent:'space-between', padding:'30px', backgroundColor:'blue'}}>
      <h2 style={{color:'white'}}><b>SmartTracker</b></h2>
      <h3>Login</h3>
      <h3>Help</h3>
    </div>
  )
}
