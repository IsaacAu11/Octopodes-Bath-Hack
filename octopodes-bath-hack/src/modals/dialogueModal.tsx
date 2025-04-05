import './dialogueModal.css';
import { XLg } from 'react-bootstrap-icons';
import { useEffect, useState } from 'react';
import AsciiArt from '../components/AsciiArt';

interface InventoryModalProps {
    onClose: () => void;
    character?: { name: string; imageURL: string } | null;
    imageUrl?: string;
}

function DialogueModal({ onClose, character }: InventoryModalProps) {
    const [isClosing, setIsClosing] = useState(false);
    const [isOpened, setIsOpened] = useState(false);
    const [characterName, setCharacterName] = useState<string | undefined>(character?.name);
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

    // Handle opening the modal (trigger animation)
    useEffect(() => {
        setIsOpened(true);
        setCharacterName(character?.name);
        setImageUrl(character?.imageURL || '');
    }, []);

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
                        TEST
                    </div>

                    <input
                        type="text"
                        className="dialogue-input"
                        placeholder="Dialogue"
                    />
                </div>
            </div>
        </>
    );
}

export default DialogueModal;
