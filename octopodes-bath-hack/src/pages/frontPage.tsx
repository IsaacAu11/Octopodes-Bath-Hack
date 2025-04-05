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
                <h1 className="game-name" >GAME NAME</h1>
                <h1 className={`front-page-title ${isOnFrontPage ? '' : 'on-front-page'}`} >Start your story:</h1>
                <div className={`input-container ${isOnFrontPage ? '' : 'on-front-page'}`}>
                    <input 
                        type="text" 
                        className={`input ${isOnFrontPage ? '' : 'on-front-page'}`} 
                        placeholder="Describe your story..." 
                        onKeyDown={handleKeyDown}
                        
                    />
                </div>

                <p className="credits">
                    Credits: Nathan Wong, Isaac Au, Oliver Claussnitzer-Brown
                </p>
            </div>
        </>
    );
}

export default FrontPage;
