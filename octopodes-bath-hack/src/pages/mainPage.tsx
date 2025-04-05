// mainPage.tsx
import { useEffect, useState } from 'react';
import './mainPage.css';
import LoadingPage from './loadingPage';
import { Backpack2 } from 'react-bootstrap-icons';
import InventoryModal from '../modals/inventoryModal';
import currentMap from '../assets/map/currentMap.json';

type MapKey = '[0, 0]' | '[1, 0]' | '[2, 0]' | '[0, 1]' | '[1, 1]' | '[2, 1]' | '[0, 2]' | '[1, 2]' | '[2, 2]';

function MainPage() {
    const [loading, setLoading] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const [showInventory, setShowInventory] = useState(false);
    const [dialogueHistory, setDialogueHistory] = useState<{ text: string; sender: string }[]>([]);

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

    return (
        <div className="main-page-container">
            <div className="navbar">
                {/* Inventory button + modal */}
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
                        placeholder="Dialogue"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const inputValue = (e.target as HTMLInputElement).value;
                                if (inputValue.trim()) {
                                    setDialogueHistory((prev) => [
                                        ...prev,
                                        { text: inputValue, sender: 'User' }, // Replace 'User' with the sender's name
                                    ]);
                                    (e.target as HTMLInputElement).value = ''; // Clear the input field
                                }
                            }
                        }}
                        onFocus={() => setIsTyping(true)}
                        onBlur={() => setIsTyping(false)}
                    />
                )}
            </div>
        </div>
    );
}

export default MainPage;
