import { Avatar, Button, Card } from "@chakra-ui/react"

const Cards = () => {
 

  return (
    <Card.Root width="320px">
     
      {/* <Card.Body gap="2"> */}
        {/* <Avatar.Root size="lg" shape="rounded"> */}
          {/* <Avatar.Image src="https://picsum.photos/200/300" />
          <Avatar.Fallback name="Nue Camp" /> */}
        {/* </Avatar.Root> */}
        {/* <Card.Title mt="2">Nue Camp</Card.Title> */}
        {/* <Card.Description>
          This is the card body. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit. Curabitur nec odio vel dui euismod fermentum.
          Curabitur nec odio vel dui euismod fermentum.
        </Card.Description> */}
      {/* </Card.Body> */}
      {/* <Card.Footer justifyContent="flex-end">
        <Button variant="outline">View</Button>
        <Button>Join</Button>
      </Card.Footer> */}
      <h2>Login</h2>
            
            <form onSubmit={handleLogin}>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
      
              </div>
              <div>
                <label>Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p style={{ color: "red" }}>{error}</p>}
              <Button type="submit">Login</Button>
            </form>
            
    </Card.Root>
  )
}
export default Cards;
