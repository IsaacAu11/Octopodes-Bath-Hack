import { useState } from 'react';
import './frontPage.css';
//import TestAscii from '../TestAscii';

function FrontPage() {
    const [isOnFrontPage, setIsOnFrontPage] = useState(true);
    
    return (
        <>  
            <h1 className={`title ${isOnFrontPage ? '' : 'on-front-page'}`} >Start your story:</h1>

            <input 
                type="text" 
                className={`input ${isOnFrontPage ? '' : 'on-front-page'}`} 
                placeholder="Enter your story here..." 
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        setIsOnFrontPage(false);
                        e.preventDefault();
                    }
                }}
            />
        </>
    );
}

export default FrontPage;