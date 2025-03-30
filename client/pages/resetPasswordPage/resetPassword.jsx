import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "../../src/index.css"
import ResetPasswordForm from '../../src/components/resetPasswordForm/ResetPasswordForm'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ResetPasswordForm />
  </StrictMode>,
)
