import React from 'react';
import './inventoryModal.css';
import { XLg } from 'react-bootstrap-icons';
import { useEffect, useState } from 'react';
import { searchImage } from '../components/ImageSearch';
import AsciiArt from '../components/AsciiArt';

type ItemType = 'weapon' | 'consumable';

interface InventoryItem {
    id: string;
    name: string;
    type: ItemType;
    description: string;
    imageUrl?: string;
    stats?: {
        damage?: number;
        healing?: number;
    };
}

interface InventoryModalProps {
    onClose: () => void;
}

function InventoryModal({ onClose }: InventoryModalProps) {
    const [isClosing, setIsClosing] = useState(false);
    const [isOpened, setIsOpened] = useState(false);
    const [inventory, setInventory] = useState<(InventoryItem | null)[]>(Array(8).fill(null));
    const [draggedItem, setDraggedItem] = useState<number | null>(null);
    const [selectedItem, setSelectedItem] = useState<number | null>(null);

    // Example items - replace with actual game items later
    const exampleItems: InventoryItem[] = [
        { 
            id: '1', 
            name: 'Rusty Sword', 
            type: 'weapon', 
            description: 'An old but reliable blade',
            stats: { damage: 5 }
        },
        { 
            id: '2', 
            name: 'Health Potion', 
            type: 'consumable', 
            description: 'Restores 50 HP',
            stats: { healing: 50 }
        },
        { 
            id: '3', 
            name: 'Battle Axe', 
            type: 'weapon', 
            description: 'Heavy but powerful',
            stats: { damage: 8 }
        },
        { 
            id: '4', 
            name: 'Greater Health Potion', 
            type: 'consumable', 
            description: 'Restores 100 HP',
            stats: { healing: 100 }
        },
        { 
            id: '5', 
            name: 'Excalibur', 
            type: 'weapon', 
            description: 'The legendary sword of kings',
            stats: { damage: 20 }
        }
    ];

    const loadItemImages = async () => {
        const setting = localStorage.getItem('setting') || '';
        const itemsWithImages = await Promise.all(
            exampleItems.map(async (item) => {
                const searchTerm = `${setting} ${item.name} ${item.type === 'weapon' ? 'weapon' : 'potion'} pixel art`;
                const imageUrl = await searchImage(searchTerm);
                return { ...item, imageUrl };
            })
        );
        
        const initialInventory = Array(8).fill(null);
        itemsWithImages.forEach((item, index) => {
            if (index < 5) initialInventory[index] = item;
        });
        setInventory(initialInventory);
    };

    useEffect(() => {
        setIsOpened(true);
        loadItemImages();
    }, []);

    const handleClose = () => {
        setIsClosing(true);
    };

    useEffect(() => {
        if (isClosing) {
            setTimeout(() => {
                onClose();
            }, 300);
        }
    }, [isClosing, onClose]);

    const handleDragStart = (index: number) => {
        if (inventory[index]) {
            setDraggedItem(index);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (targetIndex: number) => {
        if (draggedItem !== null && draggedItem !== targetIndex) {
            const newInventory = [...inventory];
            const temp = newInventory[targetIndex];
            newInventory[targetIndex] = newInventory[draggedItem];
            newInventory[draggedItem] = temp;
            setInventory(newInventory);
        }
        setDraggedItem(null);
    };

    const handleItemClick = (index: number) => {
        setSelectedItem(selectedItem === index ? null : index);
    };

    const useItem = (index: number) => {
        const item = inventory[index];
        if (!item) return;

        if (item.type === 'consumable') {
            // Here you would implement the actual consumption logic
            console.log(`Used ${item.name} - Healing for ${item.stats?.healing}`);
            const newInventory = [...inventory];
            newInventory[index] = null;
            setInventory(newInventory);
        }
        setSelectedItem(null);
    };

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
                    <div className="inventory-grid">
                        {inventory.map((item, index) => (
                            <div 
                                key={index} 
                                className={`inventory-slot ${item ? `item-type-${item.type}` : ''} ${selectedItem === index ? 'selected' : ''}`}
                                draggable={!!item}
                                onDragStart={() => handleDragStart(index)}
                                onDragOver={handleDragOver}
                                onDrop={() => handleDrop(index)}
                                onClick={() => handleItemClick(index)}
                                title={item ? `${item.name}\n${item.description}${item.stats ? `\n${item.type === 'weapon' ? `Damage: ${item.stats.damage}` : `Healing: ${item.stats.healing}`}` : ''}` : 'Empty Slot'}
                            >
                                {item ? (
                                    <>
                                        {item.imageUrl && (
                                            <div className="item-icon">
                                                <AsciiArt 
                                                    imageUrl={item.imageUrl} 
                                                    width={20} 
                                                    height={20}
                                                />
                                            </div>
                                        )}
                                        <div className="item-name">{item.name}</div>
                                        <div className="item-type">{item.type}</div>
                                        {selectedItem === index && item.type === 'consumable' && (
                                            <button 
                                                className="use-item-button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    useItem(index);
                                                }}
                                            >
                                                Use
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <div className="empty-slot">Empty</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default InventoryModal; 