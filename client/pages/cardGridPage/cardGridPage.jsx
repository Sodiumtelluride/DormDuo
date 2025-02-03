import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import '../../src/components/card/Card.css'
import CardGrid from "../../src/components/cardGrid/CardGrid.jsx";
import "./cardGridPage.css"

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <CardGrid />
    </StrictMode>,
)
