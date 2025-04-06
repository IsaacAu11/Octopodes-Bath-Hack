// mainPage.tsx
import { useState, useEffect } from 'react';
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

const characters: StoryCharacter[] = [
    { name: "John the Pirate", occupation: "Medival Pirate Captain" },
    { name: "Sarah the Merchant", occupation: "Medival Traveling Merchant" },
    { name: "Mark the Traveler", occupation: "Medival Wandering Explorer" }
];

//todo: make it so chatgpt goes through the input prompt and returns the setting of the story

function MainPage() {
    // const [isTyping, setIsTyping] = useState(false);
    const setting = localStorage.getItem('setting');
    const [showInventory, setShowInventory] = useState(false);
    const [showStoryLine, setShowStoryLine] = useState(true);
    const [showCombat, setShowCombat] = useState(false);
    // const [dialogueHistory, setDialogueHistory] = useState<{ text: string; sender: string }[]>([]);
    const [character, setCharacter] = useState<{ name: string; imageURL: string } | null>(null);
    const [showDialogueModal, setShowDialogueModal] = useState(false);
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
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                const key = `[${x}, ${y}]`;
                const cell = currentMap.locations[key as MapKey];
                const isCenterCell = x === 1 && y === 1;
    
                const locationName = cell && typeof cell === 'object' && 'location' in cell ? cell.location : "Undiscovered...";
                const information = cell && typeof cell === 'object' && 'description' in cell ? cell.description : "No description available";
    
                grid.push(
                    <div  
                        className={isCenterCell ? "center-grid-cell" : "grid-cell"} 
                        key={key} 
                        onClick={async () => {
                            const moveX = x - 1;
                            const moveY = y - 1;
    
                            const moveKey: MoveKey = `[${moveX}, ${moveY}]` as MoveKey;
                            await fetchMoveToGrid(moveKey);
                        }}>
                        <div className="cell-location">{locationName}</div>
                        {/* <div className="cell-travel">{information}</div> */}
                    </div>
                );
            }
        }
        return grid;
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://127.0.0.1:8000/test');
            const data = await response.json();
            console.log("Response from backend:", data);
        };
        fetchData();
    }, [showInventory]);

    const fetchMoveToGrid = async (moveKey: MoveKey) => {
        // Mapping the moveKey to a relative change in coordinates
        const moveMap: { [key in MoveKey]: [number, number] } = {
            '[-1, -1]': [-1, -1],
            '[0, -1]': [0, -1],
            '[1, -1]': [1, -1],
            '[-1, 0]': [-1, 0],
            '[0,0]': [0, 0],
            '[1, 0]': [1, 0],
            '[-1, 1]': [-1, 1],
            '[0, 1]': [0, 1],
            '[1, 1]': [1, 1],
        };

        // Get the movement direction
        const [dx, dy] = moveMap[moveKey];

        // Update the current position
        const newX = x + dx;
        const newY = y + dy;

        const response = await fetch(`http://127.0.0.1:8000/move?x=${newX}&y=${newY}`, {
            method: "POST",
            headers: {
                "Accept": "application/json"
            },
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            console.log("New Map Data:", data);
            // Save the new map to localStorage
            localStorage.setItem('currentMap', JSON.stringify(data));

            // Update the state for the new position
            setX(newX);
            setY(newY);
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
                You are at: {currentMap.locations['[1, 1]'] && 'location' in currentMap.locations['[1, 1]'] ? currentMap.locations['[1, 1]']?.location : 'Unknown...'}
            </h1>
                <div className="side-list">
                    <p className="side-list-title">Characters</p>
                    {characters.map((char, index) => (
                        <div 
                            key={index}
                            className="side-list-item" 
                            onClick={() => handleDialogueClick(char)}
                        >
                            {char.name}
                        </div>
                    ))}
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
