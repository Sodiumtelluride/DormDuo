import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "../../src/index.css"
import ForgotPasswordForm from '../../src/components/forgotPasswordForm/ForgotPasswordForm'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ForgotPasswordForm />
  </StrictMode>,
)
