import './App.css'
import './SamplesPage.css'
import './ReservationsPage.css'
import './HomePage.css'
import NavBar from './NavBar'
import { Outlet } from 'react-router-dom'

function App() {

  return (
    <>
      <NavBar/>
      <Outlet/>
    </>
  )
}

export default App;
