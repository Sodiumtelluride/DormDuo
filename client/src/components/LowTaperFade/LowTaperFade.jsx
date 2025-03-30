import './LowTaperFade.css';
import { useEffect } from 'react';

export default function LowTaperFade() {
    
    useEffect(() => {
        const handleScroll = () => {
            const element = document.querySelector('.LowTaperFade');
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const fadeStart = documentHeight - windowHeight - 200; // Start fading 200px before bottom
            const fadeEnd = documentHeight - windowHeight;

            if (scrollPosition >= fadeStart) {
            const opacity = Math.max(0, 1 - (scrollPosition - fadeStart) / (fadeEnd - fadeStart));
            element.style.opacity = opacity;
            } else {
            element.style.opacity = 1;
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial call to set opacity
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    return(
        <div className='LowTaperFade'></div>
    )
}