import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import toast from 'react-hot-toast';
import CoinFlip from '../components/Games/CoinFlip';
import DiceRoll from '../components/Games/DiceRoll';
import SlotMachine from '../components/Games/SlotMachine';

export default function GamePage() {
    const { slug } = useParams();
    const { user, updateBalance } = useAuth();
    const [game, setGame] = useState(null);
    const [betAmount, setBetAmount] = useState('');
    const [result, setResult] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const res = await api.get(`/games/${slug}`);
                setGame(res.data.game);
                setBetAmount(res.data.game.min_bet);
            } catch {
                toast.error('Game not found');
            } finally {
                setLoading(false);
            }
        };
        fetchGame();
    }, [slug]);

    const handlePlay = async (choice) => {
        if (!betAmount || parseFloat(betAmount) <= 0) {
            toast.error('Enter a bet amount');
            return;
        }
        setPlaying(true);
        setResult(null);

        try {
            const res = await api.post(`/games/${slug}/play`, {
                amount: parseFloat(betAmount),
                choice,
            });
            updateBalance(res.data.balance);

            setTimeout(() => {
                setResult(res.data);
                if (res.data.bet.status === 'won') {
                    toast.success(`You won $${parseFloat(res.data.payout).toFixed(2)}!`);
                } else {
                    toast.error('You lost! Better luck next time.');
                }
                setPlaying(false);
            }, 500);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong');
            setPlaying(false);
        }
    };

    if (loading) return <p style={{ textAlign: 'center', padding: '2rem' }}>Loading...</p>;
    if (!game) return <p style={{ textAlign: 'center', padding: '2rem' }}>Game not found</p>;

    const gameComponents = {
        coin_flip: CoinFlip,
        dice_roll: DiceRoll,
        slot_machine: SlotMachine,
    };

    const GameComponent = gameComponents[game.type];

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ color: '#e94560', marginBottom: '0.5rem' }}>{game.name}</h1>
                <p style={{ color: '#aaa' }}>{game.description}</p>
                <p style={{ color: '#666', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                    Bet: ${game.min_bet} - ${game.max_bet} • Multiplier: {game.multiplier}x
                </p>
            </div>

            <div style={{
                background: '#16213e',
                borderRadius: '12px',
                padding: '1rem',
                textAlign: 'center',
                marginBottom: '1.5rem',
                border: '1px solid #0f3460',
            }}>
                <span style={{ color: '#aaa' }}>Balance: </span>
                <span style={{ color: '#4ade80', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    ${parseFloat(user?.wallet?.balance || 0).toFixed(2)}
                </span>
            </div>

            <div style={{
                background: '#16213e',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                border: '1px solid #0f3460',
            }}>
                <label style={{ color: '#aaa', display: 'block', marginBottom: '0.5rem' }}>Bet Amount</label>
                <input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    min={game.min_bet}
                    max={game.max_bet}
                    style={inputStyle}
                />
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.8rem' }}>
                    {[game.min_bet, 10, 50, 100, game.max_bet].filter((v, i, a) => a.indexOf(v) === i).map((val) => (
                        <button
                            key={val}
                            onClick={() => setBetAmount(val)}
                            style={{
                                flex: 1,
                                padding: '0.4rem',
                                borderRadius: '6px',
                                border: '1px solid #333',
                                background: parseFloat(betAmount) === val ? '#e94560' : '#0f0f23',
                                color: '#fff',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                            }}
                        >
                            ${val}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{
                background: '#16213e',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                border: '1px solid #0f3460',
            }}>
                {GameComponent && <GameComponent onPlay={handlePlay} disabled={playing} />}
            </div>

            {result && (
                <div style={{
                    background: result.bet.status === 'won' ? '#0a2e1a' : '#2e0a0a',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    textAlign: 'center',
                    border: `1px solid ${result.bet.status === 'won' ? '#4ade80' : '#f87171'}`,
                }}>
                    <h2 style={{ color: result.bet.status === 'won' ? '#4ade80' : '#f87171', marginBottom: '0.5rem' }}>
                        {result.bet.status === 'won' ? '🎉 YOU WON!' : '😞 YOU LOST'}
                    </h2>
                    <p style={{ color: '#aaa', marginBottom: '0.5rem' }}>
                        Result: <strong style={{ color: '#fff' }}>{result.game_result.result}</strong>
                    </p>
                    {result.bet.status === 'won' && (
                        <p style={{ color: '#4ade80', fontSize: '1.3rem', fontWeight: 'bold' }}>
                            +${parseFloat(result.payout).toFixed(2)}
                        </p>
                    )}
                    {game.type === 'slot_machine' && result.game_result.reels && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem', fontSize: '2rem' }}>
                            {result.game_result.reels.map((reel, i) => (
                                <span key={i} style={{
                                    background: '#16213e',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '8px',
                                    border: '1px solid #333',
                                }}>
                                    {reel}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

const inputStyle = {
    width: '100%',
    padding: '0.8rem',
    borderRadius: '8px',
    border: '1px solid #333',
    background: '#0f0f23',
    color: '#fff',
    fontSize: '1rem',
};