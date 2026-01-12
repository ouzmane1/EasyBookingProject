import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // On appelle l'API
    fetch('http://localhost:5000/api/message')
      .then(res => res.json())
      .then(data => setData(data.message))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="App">
      <h1>Mon Projet Fullstack</h1>
      <p>Message du backend :</p>
      <h2>{data ? data : "Chargement..."}</h2>
    </div>
  )
}

export default App