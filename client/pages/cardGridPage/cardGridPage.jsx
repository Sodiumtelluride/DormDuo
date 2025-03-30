import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../../src/components/cardExpanded/CardExpanded.css'
import CardGrid from "../../src/components/cardGrid/CardGrid.jsx";
import "./cardGridPage.css"
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <CardGrid />
    </StrictMode>,
)
