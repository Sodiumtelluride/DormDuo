import React, { useState, createContext } from 'react'
import './App.css'
import Navbar from './components/navbar/navbar.jsx'
import Card from './components/card/Card.jsx'
import LowTaperFade from './components/LowTaperFade/LowTaperFade.jsx'
import CardGrid from './components/cardGrid/CardGrid.jsx'
import CardExpanded from './components/cardExpanded/cardExpanded.jsx'
import PFP from './assets/UserPhoto.png'
import MessageDashboard from './components/messageDashboard/MessageDashboard.jsx'
import LandingPage from './components/landingPage/landingPage.jsx'
import NavbarLandingPage from './components/navbarLandingPage/NavbarLandingPage.jsx'
// import PFPProvider from './components/PFPPRovider/PFPProvider.jsx'
import PFPUdpdater from './components/PFPUpdater/PFPUpdater.jsx'

// export const Context = React.createContext()
function App() {
  return (
    // <Context.Provider value={[PFPUrl, setPFPUrl]}>
    <>
      <Navbar/>
      <LandingPage/>
      <LowTaperFade/> 
    </>
    // </Context.Provider>
  )
}

export default App
