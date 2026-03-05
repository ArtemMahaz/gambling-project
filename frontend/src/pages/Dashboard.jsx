import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Dashboard() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const res = await api.get('/games');
                setGames(res.data.games);
            } catch {
                toast.error('Failed to load games');
            } finally {
                setLoading(false);
            }
        };
        fetchGames();
    }, []);

    if (loading) return <p style={{ textAlign: 'center', padding: '2rem' }}>Loading games...</p>;

    const gameEmojis = {
        coin_flip: '🪙',
        dice_roll: '🎲',
        slot_machine: '🎰',
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem', color: '#e94560' }}>Choose Your Game</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {games.map((game) => (
                    <Link
                        to={`/games/${game.slug}`}
                        key={game.id}
                        style={{
                            background: '#16213e',
                            borderRadius: '12px',
                            padding: '2rem',
                            textDecoration: 'none',
                            color: '#fff',
                            border: '1px solid #0f3460',
                            transition: 'transform 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                            {gameEmojis[game.type] || '🎮'}
                        </div>
                        <h2 style={{ marginBottom: '0.5rem' }}>{game.name}</h2>
                        <p style={{ color: '#aaa', marginBottom: '1rem', fontSize: '0.9rem' }}>{game.description}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#e94560' }}>
                            <span>Min: ${game.min_bet}</span>
                            <span>Max: ${game.max_bet}</span>
                            <span>{game.multiplier}x</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}