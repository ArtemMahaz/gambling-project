import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function GameManagement() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchGames();
    }, []);

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

    const handleToggle = async (gameId, gameName, isActive) => {
        const action = isActive ? 'deactivate' : 'activate';
        if (!confirm(`Are you sure you want to ${action} ${gameName}?`)) return;

        try {
            const res = await api.patch(`/admin/games/${gameId}/toggle`);
            toast.success(res.data.message);
            fetchGames();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Action failed');
        }
    };

    if (loading) return <p style={{ textAlign: 'center', padding: '2rem' }}>Loading...</p>;

    const gameEmojis = {
        coin_flip: '🪙',
        dice_roll: '🎲',
        slot_machine: '🎰',
    };

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {games.map((game) => (
                    <div key={game.id} style={{
                        background: '#16213e',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        border: '1px solid #0f3460',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        opacity: game.is_active ? 1 : 0.5,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '2rem' }}>{gameEmojis[game.type] || '🎮'}</span>
                            <div>
                                <h3 style={{ marginBottom: '0.3rem' }}>{game.name}</h3>
                                <p style={{ color: '#aaa', fontSize: '0.85rem' }}>
                                    Bet: ${game.min_bet} - ${game.max_bet} • {game.multiplier}x multiplier
                                </p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{
                                padding: '0.2rem 0.6rem',
                                borderRadius: '8px',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                background: game.is_active ? '#0a2e1a' : '#2e0a0a',
                                color: game.is_active ? '#4ade80' : '#f87171',
                            }}>
                                {game.is_active ? 'ACTIVE' : 'DISABLED'}
                            </span>
                            <button
                                onClick={() => handleToggle(game.id, game.name, game.is_active)}
                                style={{
                                    padding: '0.4rem 1rem',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: game.is_active ? '#f87171' : '#4ade80',
                                    color: '#000',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    fontSize: '0.85rem',
                                }}
                            >
                                {game.is_active ? 'Disable' : 'Enable'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}