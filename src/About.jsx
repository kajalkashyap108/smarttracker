import React from 'react'
import { Avatar, Button, Card, Box, Stack } from "@chakra-ui/react"
import flowerimg from '../src/assets/gardenflower.png'
import kitchen from '../src/assets/kitchendesign.png'

export default function About() {
  return (
    <div>
      <div style={{ display: 'flex', gap:'20px', margin:'20px 0px 20px 50px' }}>
      <div>
        <div>
        <Card.Root width="270px">
        <img src={flowerimg} alt="flower" style={{ height: "150px", width: "270px" }} />


      
    </Card.Root>
        </div>
        <div style={{margin:'25px 15px '}}>
        <Box background="tomato" width="270px" padding="4" color="white">
      This is the Box
    </Box>
        </div>
        <div >
        <Card.Root width="320px">
      <Card.Body gap="2">
        <Avatar.Root size="lg" shape="rounded">
          <Avatar.Image src="https://picsum.photos/200/300" />
          <Avatar.Fallback name="Nue Camp" />
        </Avatar.Root>
        <Card.Title mt="2">Nue Camp</Card.Title>
        <Card.Description>
          This is the card body. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. Curabitur nec odio vel dui euismod fermentum.
          Curabitur nec odio vel dui euismod fermentum.
        </Card.Description>
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
          <Box background="orange" width="100%" padding="4" color="white">
           This is the Box
          </Box>
          <Box background="black" width="100%" padding="4" color="white">
           This is the Box
          </Box>
          <Box background="skyblue" width="100%" padding="4" color="white">
           This is the Box
          </Box>
          </Stack> 
          <div style={{margin:'20px'}}>
          <Card.Root width="320px">
           <img src={kitchen}/>
      
    </Card.Root>
          </div>
        </div>

        {/* column3 */}
        <div>

          <div style={{display:'flex', gap:'10px'}}>
            <div>
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
            </div>
            <div>
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
            </div>
          </div>

          <div>
          <div style={{display:'flex', gap:'10px'}}>
            <div>
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
            </div>
            <div>
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
    </div>
    </div>
    <div style={{margin:'20px 10px 0px 20px'}}>
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
    </div>
  )
}
