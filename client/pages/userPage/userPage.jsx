import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "../../src/index.css"
import UserProfile from '../../src/components/userProfile/userProfile.jsx'
import Navbar from '../../src/components/navbar/navbar.jsx'
import "./userPage.css"
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Navbar />
    <UserProfile />
  </StrictMode>,
)
