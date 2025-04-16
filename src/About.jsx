import React from 'react'
import { Avatar, Button, Card, Box, Stack } from "@chakra-ui/react"
import flowerimg from '../src/assets/gardenflower.png'
import kitchen from '../src/assets/kitchendesign.png'

export default function About() {
  return (
    <div style={{height:'100vh'}}>
       <Card.Root style={{width:'70%', margin: '3% 50% 30% 20%', backgroundColor:'pink'}}>
           
      
   
      <div style={{ display: 'flex', gap:'10px', margin:'20px 0px 20px 50px' }}>
      <div>
        <div>
        <Card.Root style={{ width: "270px", borderRadius: "16px" }}>
        <img src={flowerimg} alt="flower" style={{ height: "150px", width: "270px",  borderRadius:"16px" }} />
    </Card.Root>
        </div>
        <div style={{margin:'25px 15px'}}>
        <Box background='orange' width="270px" padding="4" color="white" borderRadius='16px' >
      This is the Box
    </Box>
        </div>
        <div >
        <Card.Root style={{ width: "270px", borderRadius: "16px" }}>
      <Card.Body gap="2">
        <Avatar.Root size="lg" shape="rounded">
          <Avatar.Image src="https://picsum.photos/200/300" />
          <Avatar.Fallback name="Nue Camp" />
        </Avatar.Root>
        <Card.Title mt="2">Nue Camp</Card.Title>
       
      </Card.Body>
      <Card.Footer justifyContent="flex-end">
        <Button variant="outline">View</Button>
        <Button>Join</Button>
      </Card.Footer>
    </Card.Root>
        </div>
        </div>

       {/* column2 */}
        <div>
         <Stack spacing={4}>
          <Box background="orange" width="100%" padding="4" color="white" borderRadius='16px' height='65px'>
           This is the Box
          </Box>
          <Box background="black" width="100%" padding="4" color="white" borderRadius='16px' height='65px'>
           This is the Box
          </Box>
          <Box background="skyblue" width="100%" padding="4" color="white" borderRadius='16px' height='65px'>
           This is the Box
          </Box>
          </Stack> 
          <div style={{margin:'47px'}}>
          <Card.Root style={{ width: "200px", height:'220px', borderRadius: "16px", overflow: "hidden" }}>
           <img src={kitchen} style={{height:'220px'}}/>
      
    </Card.Root>
          </div>
        </div>

        {/* column3 */}
        <div>

          <div style={{display:'flex', gap:'5px'}}>
            <div>
            <Card.Root width="110px">
      <Card.Body gap="2">
        
        <Card.Title mt="2">Nue Camp</Card.Title>
      </Card.Body>
    
    </Card.Root>
            </div>
            <div>
            <Card.Root width="110px">
      <Card.Body gap="2">
        
        <Card.Title mt="2">Nue Camp</Card.Title>
      </Card.Body>  
    </Card.Root>
            </div>
          </div>

          <div>
          <div style={{display:'flex', gap:'5px', margin:'5px'}}>
            <div>
            <Card.Root width="110px">
      <Card.Body gap="2">
        
        <Card.Title mt="2">Nue Camp</Card.Title>
      </Card.Body>
    </Card.Root>
            </div>
            <div>
            <Card.Root style={{width:'110px'}}>
      <Card.Body gap="2">
       
        <Card.Title mt="2">Nue Camp</Card.Title>
      </Card.Body>
    </Card.Root>
    </div>
    </div>
    <div style={{margin:'20px 10px 0px 20px'}}>
    <Card.Root style={{width:'350px'}}>
      <Card.Body gap="2">
        <Avatar.Root size="lg" shape="rounded">
          <Avatar.Image src="https://picsum.photos/200/300" />
          <Avatar.Fallback name="Nue Camp" />
        </Avatar.Root>
        <Card.Title mt="2">Nue Camp</Card.Title>
       
      </Card.Body>
      <Card.Footer justifyContent="flex-end">
        <Button variant="outline">View</Button>
        <Button>Join</Button>
      </Card.Footer>
    </Card.Root>
    </div>
            
          </div>
        </div>





        {/* <div>
          <div style={{display:'flex', gap:'20px'}}> */}
          {/* <div>
          <Card.Root width="320px">
      <Card.Body gap="2">
        <Avatar.Root size="lg" shape="rounded">
          <Avatar.Image src="https://picsum.photos/200/300" />
          <Avatar.Fallback name="Nue Camp" />
        </Avatar.Root>
        <Card.Title mt="2">Nue Camp</Card.Title>
       
      </Card.Body>
      <Card.Footer justifyContent="flex-end">
        <Button variant="outline">View</Button>
        <Button>Join</Button>
      </Card.Footer>
    </Card.Root>
          </div> */}

          {/* <div>
          <Card.Root width="320px">
      <Card.Body gap="2">
        <Avatar.Root size="lg" shape="rounded">
          <Avatar.Image src="https://picsum.photos/200/300" />
          <Avatar.Fallback name="Nue Camp" />
        </Avatar.Root>
        <Card.Title mt="2">Nue Camp</Card.Title>
       
      </Card.Body>
      <Card.Footer justifyContent="flex-end">
        <Button variant="outline">View</Button>
        <Button>Join</Button>
      </Card.Footer>
    </Card.Root>
          </div> */}

          {/* <div>
          <Card.Root width="320px">
      <Card.Body gap="2">
        <Avatar.Root size="lg" shape="rounded">
          <Avatar.Image src="https://picsum.photos/200/300" />
          <Avatar.Fallback name="Nue Camp" />
        </Avatar.Root>
        <Card.Title mt="2">Nue Camp</Card.Title>
       
      </Card.Body>
      <Card.Footer justifyContent="flex-end">
        <Button variant="outline">View</Button>
        <Button>Join</Button>
      </Card.Footer>
    </Card.Root>
          </div> */}
        {/* </div>
      </div> */}
    </div>
    </Card.Root>
    </div>
  )
}
