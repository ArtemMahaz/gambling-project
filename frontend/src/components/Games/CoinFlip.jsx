import { useState } from 'react';

export default function CoinFlip({ onPlay, disabled }) {
    const [choice, setChoice] = useState('');

    return (
        <div>
            <h3 style={{ marginBottom: '1rem', color: '#ccc' }}>Pick a side</h3>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                {['heads', 'tails'].map((side) => (
                    <button
                        key={side}
                        onClick={() => setChoice(side)}
                        style={{
                            flex: 1,
                            padding: '1.5rem',
                            borderRadius: '12px',
                            border: choice === side ? '2px solid #e94560' : '2px solid #333',
                            background: choice === side ? '#1a1a3e' : '#16213e',
                            color: '#fff',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                        }}
                    >
                        {side === 'heads' ? '👑' : '🔢'} {side}
                    </button>
                ))}
            </div>
            <button
                onClick={() => choice && onPlay(choice)}
                disabled={!choice || disabled}
                style={playBtnStyle}
            >
                Flip Coin
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