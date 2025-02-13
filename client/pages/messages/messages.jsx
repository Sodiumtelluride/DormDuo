import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "../../src/index.css"
import MessageDashboard from '../../src/components/messageDashboard/MessageDashboard.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MessageDashboard/>
  </StrictMode>,
)
