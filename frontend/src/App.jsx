import { useEffect, useState } from 'react'
import axios from 'axios';


function App() {
  const [jokes, setJokes] = useState([])

  useEffect(() => {
    axios.get("/api/jokes")
      .then((response) => {
        setJokes(response.data)
      })
      .catch((error) => {
        console.log(error)
      })

  }, [])
  return (
    <>
      <h1>heloo </h1>
      <p>Jokes : {jokes.length}</p>


      {
        jokes.map((joke, index) => (
          <div key={jokes.id}>
            <h3>{joke.id}</h3>
            <h4>{joke.title}</h4>
            <p>{joke.content}</p>
          </div>
        ))
      }


    </>
  )
}

export default App
