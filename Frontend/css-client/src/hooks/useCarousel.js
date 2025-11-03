import { useState, useEffect } from 'react';  

const useCarousel = (initialIndex, images) => {  
    const [currentIndex, setCurrentIndex] = useState(initialIndex);  

    const handleNext = () => {  
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);  
    };  

    const handlePrev = () => {  
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);  
    };  

    // Cambiar de imagen cada 5 segundos  
    useEffect(() => {  
        const interval = setInterval(handleNext, 5000);  
        return () => clearInterval(interval); 
    }, [images.length]);  

    return { currentIndex, handleNext, handlePrev };  
};  

export default useCarousel;