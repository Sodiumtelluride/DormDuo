import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import CardGrid from "../../src/components/cardGrid/CardGrid";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <CardGrid/>
    </StrictMode>   
)