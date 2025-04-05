import './combatModal.css';
import { XLg } from 'react-bootstrap-icons';
import { useEffect, useState, useRef } from 'react';
// Removed unused import

interface CombatModalProps {
    onClose: () => void;
}

function CombatModal({ onClose }: CombatModalProps) {
    const [isClosing, setIsClosing] = useState(false);
    const [isOpened, setIsOpened] = useState(false);

    // Combat State
    const [playerHealth, setPlayerHealth] = useState(100);
    const [enemyHealth, setEnemyHealth] = useState(100);
    const playerDamage = 15;
    const enemyDamage = 12;
    const [winner, setWinner] = useState<string | null>(null);
    const [isAttacking, setIsAttacking] = useState(false);
    const [playerHitValue, setPlayerHitValue] = useState<number | null>(null);
    const [enemyHitValue, setEnemyHitValue] = useState<number | null>(null);
    const attackLockRef = useRef(false);


    useEffect(() => {
        setIsOpened(true);
    }, []);

    useEffect(() => {
        if (isClosing) {
            setTimeout(() => {
                onClose();
            }, 300);
        }
    }, [isClosing, onClose]);

    function getRandomDamage(base: number, variance: number = 0.2) {
        const min = base * (1 - variance);
        const max = base * (1 + variance);
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    const handleAttack = () => {
        if (isAttacking || winner || attackLockRef.current) return;
    
        setIsAttacking(true);
        attackLockRef.current = true;
    
        const playerHit = getRandomDamage(playerDamage);
        const enemyHit = getRandomDamage(enemyDamage);
    
        setPlayerHitValue(playerHit);
        setTimeout(() => setPlayerHitValue(null), 1500);
    
        setEnemyHealth(prev => {
            const newEnemyHealth = Math.max(prev - playerHit, 0);
    
            if (newEnemyHealth <= 0) {
                setWinner('Player Wins!');
                setIsAttacking(false);
                attackLockRef.current = false;
            } else {
                setTimeout(() => {
                    setEnemyHitValue(enemyHit);
                    setTimeout(() => setEnemyHitValue(null), 1500);
    
                    setPlayerHealth(prev => {
                        const newPlayerHealth = Math.max(prev - enemyHit/2, 0);
                        if (newPlayerHealth <= 0) {
                            setWinner('Enemy Wins!');
                        }
                        setIsAttacking(false);
                        attackLockRef.current = false;
                        return newPlayerHealth;
                    });
                }, 1000);
            }
    
            return newEnemyHealth;
        });
    };
    
    

    // Determine winner
    useEffect(() => {
        if (enemyHealth <= 0 && playerHealth <= 0) {
            setWinner('Draw');
        } else if (enemyHealth <= 0) {
            setWinner('Player Wins!');
        } else if (playerHealth <= 0) {
            setWinner('Enemy Wins!');
        }
    }, [playerHealth, enemyHealth]);

    const handleClose = () => {
        setIsClosing(true);
    };

    return (
        <>
            <div className={`overlay ${isOpened ? 'open' : ''} ${isClosing ? 'closing' : ''}`} />
            <div className="combat-container">
                <XLg 
                    className="close-button" 
                    size={50} 
                    color="white" 
                    onClick={handleClose} 
                />
                <div 
                    className={`combat-modal ${isOpened ? 'open' : ''} ${isClosing ? 'closing' : ''}`}
                >
                    <p className="modal-title">Combat</p>

                    <div className="combat-box">
                        <div className="fighter">
                            <h2>Player</h2>
                            <div className="health-damage">
                                <p style={{fontSize: "1.2rem"}}>Health: {playerHealth}</p>
                                {enemyHitValue !== null && (
                                    <p className="hit-damage">-{enemyHitValue}</p>
                                )}
                            </div>
                        </div>

                        <div className="fighter">
                            <h2>Enemy</h2>
                            <div className="health-damage">
                                <p style={{fontSize: "1.2rem"}}>Health: {enemyHealth}</p>
                                {playerHitValue !== null && (
                                    <p className="hit-damage">-{playerHitValue}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {winner ? (
                        <div className="winner">{winner}</div>
                    ) : (
                        <button 
                            onClick={handleAttack} 
                            className="attack-button" 
                            disabled={isAttacking}
                        >
                            Attack
                        </button>

                    )}

                </div>
            </div>
        </>
    );
}


export default CombatModal;
