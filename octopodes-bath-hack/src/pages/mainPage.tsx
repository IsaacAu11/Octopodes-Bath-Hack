import React, { useEffect, useState } from 'react';
import './mainPage.css';
import LoadingPage from './loadingPage';
import { Backpack2 } from 'react-bootstrap-icons';
import InventoryModal from '../modals/inventoryModal';
import { processMessage } from '../components/ChatProcessor';

function MainPage() {
    const [loading, setLoading] = useState(true);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showInventory, setShowInventory] = useState(false);
    const [dialogueHistory, setDialogueHistory] = useState<{ text: string; sender: string }[]>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            try {
                const response = await processMessage(inputValue);
                console.log('ChatGPT Response:', response);
                setInputValue('');
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

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