// mainPage.tsx
import {useState } from 'react';
import './mainPage.css';
import { Backpack2, Book } from 'react-bootstrap-icons';
import InventoryModal from '../modals/inventoryModal';
import currentMap from '../assets/map/currentMap.json';
//import AsciiArt from '../components/AsciiArt';
import DialogueModal from '../modals/dialogueModal';
import StoryLineModal from '../modals/storyLineModal';
import CombatModal from '../modals/combatModal';

type MapKey = '[0, 0]' | '[1, 0]' | '[2, 0]' | '[0, 1]' | '[1, 1]' | '[2, 1]' | '[0, 2]' | '[1, 2]' | '[2, 2]';

function MainPage() {
    // const [isTyping, setIsTyping] = useState(false);
    const [showInventory, setShowInventory] = useState(false);
    const [showStoryLine, setShowStoryLine] = useState(true);
    const [showCombat, setShowCombat] = useState(false);
    // const [dialogueHistory, setDialogueHistory] = useState<{ text: string; sender: string }[]>([]);
    const [character, setCharacter] = useState<{ name: string; imageURL: string } | null>(null);
    const [showDialogueModal, setShowDialogueModal] = useState(false);

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setLoading(false);
    //     }, 2000);

    //     return () => clearTimeout(timer);
    // }, []);

    const renderGrid = () => {
        const grid = [];
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                const key = `[${x}, ${y}]`;
                const cell = currentMap[key as MapKey];
                const isCenterCell = x === 1 && y === 1;
                grid.push(
                    <div className={isCenterCell ? "center-grid-cell" : "grid-cell"} key={key}>
                        <div className="cell-location">{cell?.locationName}</div>
                        <div className="cell-travel">{cell?.information}</div>
                    </div>
                );
            }
        }
        return grid;
    };

    const handleDialogueClick = (character: string, imageURL: string) => {
        setCharacter({ name: character, imageURL });
        setShowDialogueModal(true);
    };

    return (
        <div className="main-page-container">
            <div className="navbar">
                {/* Inventory button + modal */}
                <div className="navbar-item" onClick={() => setShowInventory(true)}>
                    <Backpack2 size={40} color="#a8a8a8" />
                </div>

                <div className="navbar-item" onClick={() => setShowStoryLine(true)}>
                    <Book size={40} color="#a8a8a8" />
                </div>


                {showInventory && <InventoryModal onClose={() => setShowInventory(false)} />}
            </div>

            <div className="center-container">

                <h1 className="location-title">You are at: {currentMap['[1, 1]']?.locationName || 'Unknown...'}</h1>

                <div className="side-list">
                    <p className="side-list-title">Characters</p>
                    <div className="side-list-item" onClick={() => handleDialogueClick("John the Pirate", "https://media.istockphoto.com/id/500081100/photo/portrait-of-handsome-man-in-a-pirate-costume.jpg?s=612x612&w=0&k=20&c=9OMffCTusV-wovYnuolcZ0tgpc_4sR8wY2r2vlJOnPw=")}>
                        John
                    </div>
                    <div className="side-list-item" onClick={() => handleDialogueClick("Sarah the Merchant", "https://pics.craiyon.com/2023-06-02/2f06130136ca4d9197864bdb53f2111b.webp")}>
                        Sarah
                    </div>
                    <div className="side-list-item">
                        Mark
                    </div>
                </div>
                
                <div className="grid-container">
                    {renderGrid()}
                </div>
                
                {/* {isTyping && (
                    <div className={`dialogue-history ${isTyping ? 'typing' : ''}`}>
                        {dialogueHistory.map((dialogue, index) => (
                            <div key={index} className="dialogue-bubble">
                                <strong>{dialogue.sender}:</strong> {dialogue.text}
                            </div>
                        ))}
                    </div>
                )} */}

                <div className="side-list">
                    <p className="side-list-title">Actions</p>
                    <div className="side-list-item" onClick={() => setShowCombat(true)}>
                        Fight
                    </div>
                    <div className="side-list-item">
                        Shop
                    </div>
                    <div className="side-list-item">
                        Eat
                    </div>
                </div>

                {/* {(!showDialogueModal || !showInventory) && (
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
                                        { text: inputValue, sender: 'User' },
                                    ]);
                                    (e.target as HTMLInputElement).value = ''; 
                                }
                            }
                        }}
                        onFocus={() => setIsTyping(true)}
                        onBlur={() => setIsTyping(false)}
                    />
                )} */}
                {showDialogueModal ? (
                    <DialogueModal onClose={() => {
                        setCharacter(null);
                        setShowDialogueModal(false);
                    }} 
                    character={character}
                    />
                ) : (
                    <div />
                )}

                {showStoryLine ? (<StoryLineModal onClose={() => {setShowStoryLine(false)}} />) : (<div />)}
                {showCombat ? (<CombatModal onClose={() => {setShowCombat(false)}} />) : (<div />)}

            </div>
        </div>
    );
}

export default MainPage;
