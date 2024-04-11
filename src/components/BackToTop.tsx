import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react"


function BackToTop() {
    const [showBackToTop, setShowBackToTop] = useState(false);
    const handleScroll = () => {
        if(window.scrollY > 100){
            setShowBackToTop(true)
        } else {
            setShowBackToTop(false)
        }
    }
    
    useEffect(()=>{
       
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])


    return (
        <div>
            {showBackToTop && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="fixed right-4 bottom-28 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-800"
                >
                    <ArrowUp />
                </button>
            )}
        </div>
  )
}

export default BackToTop