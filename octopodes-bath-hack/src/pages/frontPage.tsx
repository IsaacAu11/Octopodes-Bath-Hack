import React, { useState } from 'react';
import './frontPage.css';
import { initalPromptProcessing } from '../components/InitialPrompProcessing';
import LoadingPage from './loadingPage';

function FrontPage({ onEnter }: { onEnter: () => void }) {
    const [isOnFrontPage, setIsOnFrontPage] = useState(true);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    
    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setLoading(true);
            e.preventDefault();
            const result = await initalPromptProcessing(userInput);
            console.log('ChatGPT Response:', result);
            setIsOnFrontPage(false);
            setTimeout(() => {
                onEnter();
            }, 1000);
            setLoading(false);
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
            {loading && (
                <div className="loading-overlay">
                    <LoadingPage />
                </div>
            )}
        </>
    );
}

export default FrontPage; 