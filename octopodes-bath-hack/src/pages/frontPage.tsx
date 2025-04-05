import React, { useState } from 'react';
import './frontPage.css';
import { initalPromptProcessing } from '../components/InitialPrompProcessing';
import LoadingPage from './loadingPage';

function FrontPage({ onEnter }: { onEnter: () => void }) {
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [anim, setAnim] = useState(false);
    
    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setAnim(true);
            e.preventDefault();
            setTimeout(() => {
                setLoading(true);
            }, 1000);
            const result = await initalPromptProcessing(userInput);
            console.log('ChatGPT Response:', result);
            onEnter();
            setLoading(false);
        }
    }

    return (
        <>  
            <div className="container">
                <h1 className="game-name" >Algorithmia</h1>
                <h1 className={`front-page-title ${!anim ? '' : 'loading'}`} >Start your story:</h1>
                <div className={`input-container ${!anim ? '' : 'loading'}`}>
                    <input 
                        type="text" 
                        className={`input ${!anim ? '' : 'loading'}`} 
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