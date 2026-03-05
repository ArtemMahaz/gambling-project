import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function HistoryPage() {
    const [bets, setBets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBets = async () => {
            try {
                const res = await api.get('/bets');
                setBets(res.data.data);
            } catch {
                toast.error('Failed to load history');
            } finally {
                setLoading(false);
            }
        };
        fetchBets();
    }, []);

    if (loading) return <p style={{ textAlign: 'center', padding: '2rem' }}>Loading...</p>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
            <h1 style={{ color: '#e94560', marginBottom: '2rem' }}>Bet History</h1>

            {bets.length === 0 ? (
                <p style={{ color: '#aaa', textAlign: 'center' }}>No bets yet. Go play some games!</p>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ borderBottom: '1px solid #333' }}>
                            {['Game', 'Bet', 'Choice', 'Result', 'Payout', 'Status', 'Date'].map((h) => (
                                <th key={h} style={{
                                    padding: '0.8rem',
                                    textAlign: 'left',
                                    color: '#aaa',
                                    fontSize: '0.85rem',
                                    textTransform: 'uppercase',
                                }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {bets.map((bet) => (
                            <tr key={bet.id} style={{ borderBottom: '1px solid #1a1a2e' }}>
                                <td style={tdStyle}>{bet.game?.name || 'Unknown'}</td>
                                <td style={tdStyle}>${parseFloat(bet.amount).toFixed(2)}</td>
                                <td style={tdStyle}>{bet.choice}</td>
                                <td style={tdStyle}>{bet.result}</td>
                                <td style={{
                                    ...tdStyle,
                                    color: bet.status === 'won' ? '#4ade80' : '#f87171',
                                    fontWeight: 'bold',
                                }}>
                                    {bet.status === 'won' ? `+$${parseFloat(bet.payout).toFixed(2)}` : '-'}
                                </td>
                                <td style={tdStyle}>
                                        <span style={{
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: '12px',
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold',
                                            background: bet.status === 'won' ? '#0a2e1a' : '#2e0a0a',
                                            color: bet.status === 'won' ? '#4ade80' : '#f87171',
                                        }}>
                                            {bet.status.toUpperCase()}
                                        </span>
                                </td>
                                <td style={{ ...tdStyle, color: '#666', fontSize: '0.85rem' }}>
                                    {new Date(bet.created_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

const tdStyle = {
    padding: '0.8rem',
    color: '#fff',
};