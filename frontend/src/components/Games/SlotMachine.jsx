export default function SlotMachine({ onPlay, disabled }) {
    return (
        <div>
            <h3 style={{ marginBottom: '1rem', color: '#ccc' }}>Spin the reels!</h3>
            <button
                onClick={() => onPlay('spin')}
                disabled={disabled}
                style={{
                    width: '100%',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #e94560, #c23152)',
                    color: '#fff',
                    fontSize: '1.3rem',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                }}
            >
                🎰 SPIN
            </button>
        </div>
    );
}