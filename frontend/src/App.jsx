import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0);
  const [msg, setMsg] = useState([]);

  useEffect(() => {
    console.log("Inside useEffect - API_BASE_URL:", process.env.VITE_API_BASE_URL); // Log inside useEffect

    fetch(`${process.env.VITE_API_BASE_URL}/healthcheck`)
      .then(res => res.json())
      .then(data => {
        console.log("API Response:", data); // Log API response
        setMsg(data);
      })
      .catch(err => console.error("Error fetching API:", process.env.VITE_API_BASE_URL, err));
  }, []);
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div>
      {msg && msg.map((data, index) => (
        <div key={index}>{data.message}</div>
      ))}
      </div>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}
  
export default App
