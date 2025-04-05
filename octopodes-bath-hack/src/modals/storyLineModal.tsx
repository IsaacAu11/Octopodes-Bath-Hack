import './storyLineModal.css';
import { XLg } from 'react-bootstrap-icons';
import { useEffect, useState } from 'react';


const StoryLineModal = ({ onClose, }: { onClose: () => void;  }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [isOpened, setIsOpened] = useState(false);
    const storedStoryline = localStorage.getItem('storyline');

    // Handle opening the modal (trigger animation)
    useEffect(() => {
        setIsOpened(true);
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
            <div className={`overlay ${isOpened ? 'open' : ''} ${isClosing ? 'closing' : ''}`}/>
            <div className="story-line-container">
                <XLg 
                    className="close-button" 
                    size={50} 
                    color="white" 
                    onClick={handleClose} 
                />
                <div 
                    className={`story-line-modal ${isOpened ? 'open' : ''} ${isClosing ? 'closing' : ''}`}
                >
                    <p className="story-line-modal-title">The story...</p>
                    <p className="story-line-text">{storedStoryline}</p>
                </div>
            </div>
        </>
    );
}

export default StoryLineModal;
