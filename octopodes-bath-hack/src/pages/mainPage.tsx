// mainPage.tsx
import { useState, useEffect, useCallback } from 'react';
import './mainPage.css';
import { Backpack2, Book } from 'react-bootstrap-icons';
import InventoryModal from '../modals/inventoryModal';
//import AsciiArt from '../components/AsciiArt';
import DialogueModal from '../modals/dialogueModal';
import StoryLineModal from '../modals/storyLineModal';
import CombatModal from '../modals/combatModal';
import { searchImage } from '../components/ImageSearch';
// import currentMap from '../assets/map/currentMap.json';

type MapKey = '[0, 0]' | '[1, 0]' | '[2, 0]' | '[0, 1]' | '[1, 1]' | '[2, 1]' | '[0, 2]' | '[1, 2]' | '[2, 2]';
type MoveKey = '[-1, -1]' | '[0, -1]' | '[1, -1]' | '[-1, 0]' | '[0,0]' | '[1, 0]' | '[-1, 1]' | '[0, 1]' | '[1, 1]';

interface StoryCharacter {
    name: string;
    occupation: string;
}

interface MapData {
    locations: {
        [key: string]: {
            location: string;
            description: string;
            characters: string[];
        } | null;
    };
    characters: [string, string][];
    num_locations: number;
}

// Updated to get character data from the global character list based on names
function getCharacterDetails(characterName: string, allCharacters: [string, string][]): StoryCharacter {
    const characterData = allCharacters.find(char => char[0] === characterName);
    return {
        name: characterName,
        occupation: characterData ? characterData[1] : "Unknown"
    };
}

// Load map data from localStorage
function loadMapData(): MapData | null {
    try {
        const storedCurrentMap = localStorage.getItem('currentMap');
        if (storedCurrentMap) {
            return JSON.parse(JSON.parse(storedCurrentMap));
        }
    } catch (error) {
        console.error('Error loading map data:', error);
    }
    return null;
}

function MainPage() {
    // const [isTyping, setIsTyping] = useState(false);
    const setting = localStorage.getItem('setting');
    const [showInventory, setShowInventory] = useState(false);
    const [showStoryLine, setShowStoryLine] = useState(true);
    const [showCombat, setShowCombat] = useState(false);
    // const [dialogueHistory, setDialogueHistory] = useState<{ text: string; sender: string }[]>([]);
    const [character, setCharacter] = useState<{ name: string; imageURL: string } | null>(null);
    const [showDialogueModal, setShowDialogueModal] = useState(false);
    
    // Store map data in state instead of ref
    const storedCurrentMap = localStorage.getItem('currentMap');
    const currentMap = storedCurrentMap ? JSON.parse(JSON.parse(storedCurrentMap)) : null;
    const [x, setX] = useState(0)
    const [y, setY] = useState(0);
    
    console.log("Current Map:", currentMap);

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setLoading(false);
    //     }, 2000);

    //     return () => clearTimeout(timer);
    // }, []);
    
    const handleDialogueClick = async (char: StoryCharacter) => {
        const searchTerm = `${setting} ${char.occupation} portrait`;
        const imageURL = await searchImage(searchTerm);
        setCharacter({ name: char.name, imageURL });
        setShowDialogueModal(true);
    };
    const renderGrid = () => {
        const grid = [];
        // Create a 3x3 grid
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                // Calculate relative movement coordinates
                const dx = col - 1;  // -1, 0, or 1
                const dy = row - 1;  // -1, 0, or 1
                
                const key = `[${col}, ${row}]`;
                const cell = currentMap.locations[key as MapKey];
                const isCenterCell = col === 1 && row === 1;
    
                const locationName = cell && typeof cell === 'object' && 'location' in cell ? cell.location : "Undiscovered...";
                const information = cell && typeof cell === 'object' && 'description' in cell ? cell.description : "No description available";
    
                grid.push(
                    <div  
                        className={isCenterCell ? "center-grid-cell" : "grid-cell"} 
                        key={key} 
                        onClick={async () => {
                            await move(dx, dy);
                        }}>
                        <div className="cell-location">{locationName}</div>
                    </div>
                );
            }
        }
        return grid;
    };
    
    const move = async (dx: number, dy: number) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/move?x=${dx}&y=${dy}`, {
                method: "POST",
                headers: { "Accept": "application/json" },
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            localStorage.setItem('currentMap', JSON.stringify(data));
            // Update the current position
            setX(prevX => prevX + dx);
            setY(prevY => prevY + dy);
        } catch (error) {
            console.error("Failed to move:", error);
            alert("Failed to move. Check console for details.");
        }
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

            <h1 className="location-title">
                You are at: {currentMap?.locations['[1, 1]'] && 'location' in currentMap.locations['[1, 1]'] ? currentMap.locations['[1, 1]']?.location : 'Unknown...'}
            </h1>
                <div className="side-list">
                    <p className="side-list-title">Characters</p>
                    {currentMap?.characters.length > 0 ? (
                        currentMap.characters.map(([name, occupation]: [string, string], index: number) => {
                            const char = getCharacterDetails(name, currentMap.characters);
                            return (
                                <div 
                                    key={index}
                                    className="side-list-item" 
                                    onClick={() => handleDialogueClick(char)}
                                >
                                    {char.name}
                                </div>
                            );
                        })
                    ) : (
                        <div className="side-list-item-empty">No characters here</div>
                    )}
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
                    <DialogueModal 
                        onClose={() => {
                            setCharacter(null);
                            setShowDialogueModal(false);
                            // refreshMapData(); // Removed as the function is not defined
                        }} 
                        character={character}
                        mapData={currentMap}
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