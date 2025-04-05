import React, { useState } from 'react';
import './frontPage.css';
import { processMessage } from '../components/ChatProcessor';

function FrontPage({ onEnter }: { onEnter: () => void }) {
    const [isOnFrontPage, setIsOnFrontPage] = useState(true);
    const [userInput, setUserInput] = useState('');
    
    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const result = await processMessage(userInput);
            console.log('ChatGPT Response:', result);
            setIsOnFrontPage(false);
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
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
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