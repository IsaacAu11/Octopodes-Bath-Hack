// mainPage.tsx
import { useEffect, useState } from 'react';
import './mainPage.css';
import LoadingPage from './loadingPage';

function MainPage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);
    

    return (
        <div className="main-page-container">
            <div className="navbar">

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