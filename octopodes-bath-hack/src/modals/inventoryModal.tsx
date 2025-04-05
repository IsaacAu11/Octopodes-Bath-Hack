import './inventoryModal.css';
import { XLg } from 'react-bootstrap-icons';
import { useEffect, useState } from 'react';

interface InventoryModalProps {
    onClose: () => void;
}

function InventoryModal({ onClose }: InventoryModalProps) {
    const [isClosing, setIsClosing] = useState(false);
    const [isOpened, setIsOpened] = useState(false);

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
            <div className={`overlay ${isOpened ? 'open' : ''} ${isClosing ? 'closing' : ''}`} />
            <div className="inventory-container">
                <XLg 
                    className="close-button" 
                    size={50} 
                    color="white" 
                    onClick={handleClose} 
                />
                <div 
                    className={`inventory-modal ${isOpened ? 'open' : ''} ${isClosing ? 'closing' : ''}`}
                >
                    <p className="modal-title">Inventory</p>
                    TEST
                </div>
            </div>
        </>
    );
}

export default InventoryModal;
