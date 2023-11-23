import { useState } from 'react'
import './App.css'
import NavBar from './NavBar'
import { Outlet } from 'react-router-dom'

function Reservations() {
  console.log("Reservations")
}

function Samples() {
  console.log("Samples")
}

function App() {

  return (
    <>
      <NavBar/>
      <Outlet/>
    </>
  )
}

export default App;
