// FrontPage.tsx
import { useState } from 'react';
import './frontPage.css';

function FrontPage({ onEnter }: { onEnter: () => void }) {
    const [isOnFrontPage, setIsOnFrontPage] = useState(true);
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setIsOnFrontPage(false); // Switch to the main page
            setTimeout(() => {
                onEnter();
            }, 1000);
        }
    }

    return (
        <>  
            <div className="container">
                <h1 className={`title ${isOnFrontPage ? '' : 'on-front-page'}`} >Start your story:</h1>
                <div className={`input-container ${isOnFrontPage ? '' : 'on-front-page'}`}>
                    <input 
                        type="text" 
                        className={`input ${isOnFrontPage ? '' : 'on-front-page'}`} 
                        placeholder="Enter your story here..." 
                        onKeyDown={handleKeyDown}
                    />
                </div>


            </div>
        </>
    );
}

export default FrontPage;
