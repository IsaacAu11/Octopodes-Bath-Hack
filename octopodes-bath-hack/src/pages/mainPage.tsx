// mainPage.tsx
import { useEffect, useState } from 'react';
import './mainPage.css';
import LoadingPage from './loadingPage';
import { Backpack2 } from 'react-bootstrap-icons';
import InventoryModal from '../modals/inventoryModal';
import currentMap from '../assets/map/currentMap.json';
import { processMessage } from '../components/ChatProcessor';

type MapKey = '[0, 0]' | '[1, 0]' | '[2, 0]' | '[0, 1]' | '[1, 1]' | '[2, 1]' | '[0, 2]' | '[1, 2]' | '[2, 2]';

function MainPage() {
    const [loading, setLoading] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const [showInventory, setShowInventory] = useState(false);
    const [dialogueHistory, setDialogueHistory] = useState<{ text: string; sender: string }[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const renderGrid = () => {
        const grid = [];
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                const key = `[${x}, ${y}]`;
                const cell = currentMap[key as MapKey];
                grid.push(
                    <div className="grid-cell" key={key}>
                        <div className="cell-location">{cell?.locationName}</div>
                        <div className="cell-travel">{cell?.information}</div>
                    </div>
                );
            }
        }
        return grid;
    };
    const handleMessageSend = async (inputValue: string) => {
        setIsProcessing(true);
        try {
            const { response, keywords } = await processMessage(inputValue);
            
            // Add both user message and AI response to history
            setDialogueHistory(prev => [
                ...prev,
                { text: inputValue, sender: 'User' },
                { text: response, sender: 'AI' }
            ]);

            // keywords array is available here
            console.log('Extracted keywords:', keywords);
            // [
            //   ["character1", "character2"], Characters (index 0)
            //   ["location1", "location2"],   Locations (index 1)
            //   ["eventType1", "eventType2"], Event types (index 2)
            //   ["item1", "item2"]            Items (index 3)
            // ]

            // TODO: Implement the keywords into the game

        } catch (error) {
            console.error('Error processing message:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="main-page-container">
            <div className="navbar">
                {!showInventory && 
                    <div className="navbar-item" onClick={() => setShowInventory(true)}>
                        <Backpack2 size={40} color="#a8a8a8" />
                    </div>
                }
                {showInventory && <InventoryModal onClose={() => setShowInventory(false)} />}
            </div>

            {loading && (
                <div className="loading-overlay">
                    <LoadingPage />
                </div>
            )}

            <div className="center-container">
                <h1 className="location-title">You are at: {currentMap['[1, 1]']?.locationName || 'Unknown...'}</h1>

                <div className="side-list">
                    <p className="side-list-title">Characters</p>
                    <div className="side-list-item">
                        John
                    </div>
                    <div className="side-list-item">
                        Sarah
                    </div>
                    <div className="side-list-item">
                        Mark
                    </div>
                </div>

                <div className="grid-container">
                    {renderGrid()}
                </div>
                
                {isTyping && (
                    <div className={`dialogue-history ${isTyping ? 'typing' : ''}`}>
                        {dialogueHistory.map((dialogue, index) => (
                            <div key={index} className="dialogue-bubble">
                                <strong>{dialogue.sender}:</strong> {dialogue.text}
                            </div>
                        ))}
                    </div>
                )}

                <div className="side-list">
                    <p className="side-list-title">Actions</p>
                    <div className="side-list-item">
                        Fight
                    </div>
                    <div className="side-list-item">
                        Shop
                    </div>
                    <div className="side-list-item">
                        Eat
                    </div>
                </div>

                {!showInventory && (
                    <input
                        type="text"
                        className="input"
                        placeholder={isProcessing ? "Processing..." : "Dialogue"}
                        onKeyDown={async (e) => {
                            if (e.key === 'Enter') {
                                const inputValue = (e.target as HTMLInputElement).value.trim();
                                if (inputValue) {
                                    (e.target as HTMLInputElement).value = '';
                                    await handleMessageSend(inputValue);
                                }
                            }
                        }}
                        onFocus={() => setIsTyping(true)}
                        onBlur={() => setIsTyping(false)}
                        disabled={isProcessing}
                    />
                )}
            </div>
        </div>
    );
}

export default MainPage;