import React, { useState, useEffect } from 'react';
import './frontPage.css';
import { initalPromptProcessing } from '../components/InitialPrompProcessing';
import LoadingPage from './loadingPage';


function FrontPage({ onEnter }: { onEnter: () => void }) {
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [anim, setAnim] = useState(false);
    const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
    const [inputFocused, setInputFocused] = useState(false);

    const examplePrompts = [
        "A mystical forest with a hidden treasure",
        "A futuristic city with flying cars",
        "A haunted house with a dark secret",
        "A magical kingdom with talking animals",
        "A post-apocalyptic world with survival challenges",
        "A time-traveling adventure through different eras",
        "A detective solving a mysterious crime",
        "A space exploration mission to a distant planet",
        "A fantasy world with dragons and wizards",
        "A romantic story set in a small town",
        "A pirate ship chasing a legendary map",
        "A cursed village with forgotten rituals",
        "A robot gaining consciousness in a lab",
        "A portal to another dimension found in a basement",
        "A wizard school with a rebellious student",
        "A dream that keeps becoming real",
        "A hero reliving the same day to save the world",
        "A girl who can talk to ghosts",
        "A boy who wakes up with someone else's memories",
        "A magical mirror that shows alternate futures",
        "A lonely astronaut making contact with aliens",
        "A friendship between a dragon and a thief",
        "A secret society hiding in plain sight",
        "A train that never stops and changes its route",
        "A kingdom built in the clouds",
        "A talking cat guiding a young witch",
        "A submarine discovering a lost civilisation",
        "A library where stories come to life",
        "A quest to fix the cracks in reality",
        "A game that becomes too real",
        "A forest where time stands still",
        "A boy who finds a map only he can read",
        "A world where dreams are currency",
        "A circus with enchanted performers",
        "A bunker hiding the last human art",
        "A love story between two time travellers",
        "A town where no one can lie",
        "A riddle that controls the weather",
        "A thief stealing from gods",
        "A royal child raised by monsters"
    ];
    

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPromptIndex(prevIndex => (prevIndex + 1) % examplePrompts.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);
    
    
    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setAnim(true);
            e.preventDefault();
            setTimeout(() => {
                setLoading(true);
            }, 1000);
            const result = await initalPromptProcessing(userInput);
            console.log('OpenAI Response:', result);
            onEnter();
            setLoading(false);
        }
    }

    return (
        <>  


            <div className="container">
                {/* <div className={`front-page-overlay ${inputFocused ? 'focused' : ''}`} /> */}
                <h1 className="game-name" >Algorithmia</h1>
                <h1 className={`front-page-title ${!anim ? '' : 'loading'} ${!inputFocused ? '' : 'focused'}`} >Start your story:</h1>
                <div className={`input-container ${!anim ? '' : 'loading'}`}>
                    <input 
                        type="text" 
                        className={`input ${!anim ? '' : 'loading'}`} 
                        placeholder={userInput ? '' : 'Describe your story... (e.g ' + examplePrompts[currentPromptIndex] + ')'}
                        onKeyDown={handleKeyDown}
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onFocus={() => setInputFocused(true)}
                        onBlur={() => setInputFocused(false)}
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