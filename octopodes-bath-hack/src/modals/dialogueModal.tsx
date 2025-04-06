import React from 'react';
import './dialogueModal.css';
import { XLg } from 'react-bootstrap-icons';
import { useEffect, useState, useMemo, KeyboardEvent, useRef } from 'react';
import AsciiArt from '../components/AsciiArt';
import CharacterDialogues from '../components/CharacterDialogues';

interface InventoryModalProps {
    onClose: () => void;
    character?: { name: string; imageURL: string } | null;
    imageUrl?: string;
    mapData?: any;
}

// Add a new interface for chat messages
interface ChatMessage {
    sender: 'user' | 'character';
    text: string;
}

function DialogueModal({ onClose, character, mapData }: InventoryModalProps) {
    const [isClosing, setIsClosing] = useState(false);
    const [isOpened, setIsOpened] = useState(false);
    const [characterName, setCharacterName] = useState<string | undefined>(character?.name);
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
    
    // Add new state for user input and chat history
    const [userInput, setUserInput] = useState('');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [waitingForResponse, setWaitingForResponse] = useState(false);
    
    // Use a ref to track if we've added the initial greeting
    const initialGreetingAddedRef = useRef(false);
    
    // We'll use the mapData directly rather than storing it in state
    const currentLocation = useMemo(() => {
        if (mapData && mapData.locations && mapData.locations['[1, 1]']) {
            return mapData.locations['[1, 1]'];
        }
        return null;
    }, [mapData]);

    // Handle opening the modal (trigger animation)
    useEffect(() => {
        setIsOpened(true);
        setCharacterName(character?.name);
        setImageUrl(character?.imageURL || '');
        // Reset chat history and flags when opening a new dialogue
        setChatHistory([]);
        initialGreetingAddedRef.current = false;
    }, [character]);

    const handleClose = () => {
        setIsClosing(true); // Trigger the closing animation
    };

    // Reset state when closing animation finishes
    useEffect(() => {
        if (isClosing) {
            setTimeout(() => {
                onClose();
            }, 300);
        }
    }, [isClosing, onClose]);

    // Handle user input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(e.target.value);
    };

    // Handle sending a message
    const handleSendMessage = () => {
        if (userInput.trim() === '' || waitingForResponse) return;
        
        // Add user message to chat history
        const userMessage: ChatMessage = {
            sender: 'user',
            text: userInput
        };
        
        setChatHistory(prev => [...prev, userMessage]);
        setWaitingForResponse(true);
        setUserInput(''); // Clear input field
    };

    // Handle keypress (Enter to send)
    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    // Handle character response (both initial greeting and replies)
    const handleCharacterResponse = (response: string) => {
        if (response) {
            // For initial greeting, only add it if we haven't added it yet
            if (!initialGreetingAddedRef.current) {
                const characterMessage: ChatMessage = {
                    sender: 'character',
                    text: response
                };
                
                setChatHistory(prev => [...prev, characterMessage]);
                initialGreetingAddedRef.current = true;
            } 
            // For user message responses
            else if (waitingForResponse) {
                const characterMessage: ChatMessage = {
                    sender: 'character',
                    text: response
                };
                
                setChatHistory(prev => [...prev, characterMessage]);
                setWaitingForResponse(false);
            }
        }
    };

    return (
        <>  
            <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}>

                <div className={`character-ascii-art ${isOpened ? 'open' : ''} ${isClosing ? 'closing' : ''}`}>
                    <AsciiArt imageUrl={imageUrl || ''}/>
                </div>

                <XLg 
                    className="close-button" 
                    size={50} 
                    color="white" 
                    onClick={handleClose} 
                />

                <div className={`overlay ${isOpened ? 'open' : ''} ${isClosing ? 'closing' : ''}`} />
                <div className={`dialogue-container ${isOpened ? 'open' : ''} ${isClosing ? 'closing' : ''}`}>
                    
                    <div className={`dialogue-modal ${isOpened ? 'open' : ''} ${isClosing ? 'closing' : ''}`}>
                        <p className="modal-title">{characterName}</p>
                        
                        <div className="dialogue-content">
                            {/* Display chat history */}
                            {chatHistory.map((message, index) => (
                                <div key={index} className={`dialogue-message ${message.sender}`}>
                                    <span className="message-sender">{message.sender === 'user' ? 'You' : characterName}: </span>
                                    <span className="message-text">{message.text}</span>
                                </div>
                            ))}
                            
                            {/* Character Dialogues component for initial greeting and responses */}
                            <CharacterDialogues 
                                character={character || null} 
                                mapData={mapData}
                                userMessage={waitingForResponse ? chatHistory[chatHistory.length - 1]?.text : undefined}
                                onResponse={handleCharacterResponse}
                            />
                        </div>
                    </div>

                    <div className="dialogue-input-container">
                        <input
                            type="text"
                            className="dialogue-input"
                            placeholder="Type your message..."
                            value={userInput}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            disabled={waitingForResponse}
                        />
                        <button 
                            className="send-button" 
                            onClick={handleSendMessage}
                            disabled={userInput.trim() === '' || waitingForResponse}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DialogueModal; 