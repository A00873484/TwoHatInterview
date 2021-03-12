import React, { useState, useEffect } from 'react'
import './App.css';
const fetch = require("node-fetch");

function App(){
  const [chat, setChat] = useState([])
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")

  const defaultFetch = () => {
    setStatus("Chat")
    fetch(`/api/data`)
      .then(response => response.json())
      .then(chat => {
        setChat(chat)
      });
  }

  useEffect(() => {
    defaultFetch()
  }, [])

  const Search = (e) => {
    e.preventDefault()
    if(search === ""){
      defaultFetch()
    } else {
      setStatus("Search Result")
      fetch(`/api/search?search=${encodeURIComponent(search)}`)
        .then(response => response.json())
        .then(chat => {
          setChat(chat)
        });
    }
  }

  const playerChat = (message) => {
    setStatus("Player Messages")
    fetch(`/api/player?player=${encodeURIComponent(message.player)}`)
        .then(response => response.json())
        .then(chat => {
          setChat(chat)
        });
  }

  return (
    <div className="App">
      <h3>Search Chat</h3>
      <form onSubmit={Search}>
        <input type="text" value={search} onChange={(e)=>{
          setSearch(e.target.value)
        }}/>
      </form>
      <h4>{status}</h4>
      <div className="">
        {
          chat.map((message) => {
            return <p className='' onClick={()=>playerChat(message)}>{message.text}</p>
          })
          
        }
      </div>
    </div>
  );

}
export default App
