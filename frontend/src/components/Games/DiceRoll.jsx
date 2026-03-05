import { useState } from 'react';

export default function DiceRoll({ onPlay, disabled }) {
    const [choice, setChoice] = useState('');

    return (
        <div>
            <h3 style={{ marginBottom: '1rem', color: '#ccc' }}>Pick a number</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem', marginBottom: '1rem' }}>
                {['1', '2', '3', '4', '5', '6'].map((num) => (
                    <button
                        key={num}
                        onClick={() => setChoice(num)}
                        style={{
                            padding: '1.2rem',
                            borderRadius: '12px',
                            border: choice === num ? '2px solid #e94560' : '2px solid #333',
                            background: choice === num ? '#1a1a3e' : '#16213e',
                            color: '#fff',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                        }}
                    >
                        {num}
                    </button>
                ))}
            </div>
            <button
                onClick={() => choice && onPlay(choice)}
                disabled={!choice || disabled}
                style={playBtnStyle}
            >
                Roll Dice
            </button>
        </div>
    );
}

const playBtnStyle = {
    width: '100%',
    padding: '1rem',
    borderRadius: '8px',
    border: 'none',
    background: '#e94560',
    color: '#fff',
    fontSize: '1.1rem',
    cursor: 'pointer',
    fontWeight: 'bold',
};