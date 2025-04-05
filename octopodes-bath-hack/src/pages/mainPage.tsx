// mainPage.tsx
import { useEffect, useState } from 'react';
import './mainPage.css';
import LoadingPage from './loadingPage';
import { Backpack2 } from 'react-bootstrap-icons';

function MainPage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);
    

    return (
        <div className="main-page-container">
            <div className="navbar">
                {/* Inventory button + modal*/}
                {/* Bag icon using react bootstrap icon */}
                <div className="navbar-item" onClick={() => console.log('Inventory clicked')}>
                    <Backpack2 size={24} color="white" />
                </div>
                

                
            </div>
            {loading && (
                <div className="loading-overlay">
                    <LoadingPage />
                </div>
            )}

            <div className={`content ${loading ? 'hidden' : ''}`}>
                <h1 className="title">MAIN PAGE</h1>
                <input 
                    type="text" 
                    className="input" 
                    placeholder="Dialogue" 
                />
            </div>
        </div>
    );
}

export default MainPage;