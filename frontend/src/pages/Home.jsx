import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Home() {
    const { user } = useAuth();

    return (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                🎰 <span style={{ color: '#e94560' }}>GambleHub</span>
            </h1>
            <p style={{ fontSize: '1.2rem', color: '#ccc', marginBottom: '2rem' }}>
                Coin Flip • Dice Roll • Slot Machine
            </p>

            {user ? (
                <Link to="/dashboard" style={ctaStyle}>
                    Go to Games
                </Link>
            ) : (
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <Link to="/register" style={ctaStyle}>Get Started</Link>
                    <Link to="/login" style={{ ...ctaStyle, background: 'transparent', border: '2px solid #e94560' }}>
                        Login
                    </Link>
                </div>
            )}
        </div>
    );
}

const ctaStyle = {
    display: 'inline-block',
    padding: '0.8rem 2rem',
    background: '#e94560',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
};