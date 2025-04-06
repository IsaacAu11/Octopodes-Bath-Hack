// mainPage.tsx
import { useState, useEffect, useCallback, useEffect } from 'react';
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
    const [mapData, setMapData] = useState<MapData | null>(null);
    const [characters, setCharacters] = useState<StoryCharacter[]>([]);
    
    // Load map data on initial mount only
    useEffect(() => {
        const initialMapData = loadMapData();
        if (initialMapData) {
            setMapData(initialMapData);
        }
    }, []);
    
    // Update characters when map data changes
    useEffect(() => {
        if (!mapData) return;
        
        const currentLocation = mapData.locations['[1, 1]'];
        if (currentLocation && currentLocation.characters && Array.isArray(currentLocation.characters)) {
            const locationCharacters = currentLocation.characters.map((charName: string) => 
                getCharacterDetails(charName, mapData.characters)
            );
            setCharacters(locationCharacters);
        } else {
            setCharacters([]);
        }
    }, [mapData]);
    
    // Callback to refresh map data that can be safely passed to child components
    const refreshMapData = useCallback(() => {
        const newMapData = loadMapData();
        if (newMapData) {
            setMapData(newMapData);
        }
    }, []);

    const handleDialogueClick = async (char: StoryCharacter) => {
        const searchTerm = `${setting} ${char.occupation} portrait`;
        const imageURL = await searchImage(searchTerm);
        setCharacter({ name: char.name, imageURL });
        setShowDialogueModal(true);
    };

    const renderGrid = () => {
        if (!mapData) return [];
        
        const grid = [];
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                const key = `[${x}, ${y}]`;
                const cell = mapData.locations[key as MapKey];
                const isCenterCell = x === 1 && y === 1;
    
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
                You are at: {mapData?.locations['[1, 1]'] && 'location' in mapData.locations['[1, 1]'] ? mapData.locations['[1, 1]']?.location : 'Unknown...'}
            </h1>
                <div className="side-list">
                    <p className="side-list-title">Characters</p>
                    {characters.length > 0 ? (
                        characters.map((char, index) => (
                            <div 
                                key={index}
                                className="side-list-item" 
                                onClick={() => handleDialogueClick(char)}
                            >
                                {char.name}
                            </div>
                        ))
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
                            refreshMapData();
                        }} 
                        character={character}
                        mapData={mapData}
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
