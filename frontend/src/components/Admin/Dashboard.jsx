import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [recentBets, setRecentBets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const res = await api.get('/admin/dashboard');
            setStats(res.data.stats);
            setRecentBets(res.data.recent_bets);
        } catch {
            toast.error('Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p style={{ textAlign: 'center', padding: '2rem' }}>Loading...</p>;

    const statCards = [
        { label: 'Total Users', value: stats.total_users, color: '#60a5fa', icon: '👥' },
        { label: 'Total Bets', value: stats.total_bets, color: '#fbbf24', icon: '🎲' },
        { label: 'Total Wagered', value: `$${parseFloat(stats.total_wagered).toFixed(2)}`, color: '#e94560', icon: '💰' },
        { label: 'Total Payouts', value: `$${parseFloat(stats.total_payouts).toFixed(2)}`, color: '#f87171', icon: '💸' },
        { label: 'House Profit', value: `$${parseFloat(stats.house_profit).toFixed(2)}`, color: parseFloat(stats.house_profit) >= 0 ? '#4ade80' : '#f87171', icon: '🏦' },
        { label: 'Total Deposits', value: `$${parseFloat(stats.total_deposits).toFixed(2)}`, color: '#4ade80', icon: '📥' },
    ];

    return (
        <div>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem',
            }}>
                {statCards.map((card) => (
                    <div key={card.label} style={{
                        background: '#16213e',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        border: '1px solid #0f3460',
                    }}>
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{card.icon}</div>
                        <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '0.3rem' }}>{card.label}</p>
                        <p style={{ fontSize: '1.4rem', fontWeight: 'bold', color: card.color }}>{card.value}</p>
                    </div>
                ))}
            </div>

            <h2 style={{ marginBottom: '1rem' }}>Recent Bets</h2>
            {recentBets.length === 0 ? (
                <p style={{ color: '#aaa' }}>No bets yet</p>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr style={{ borderBottom: '1px solid #333' }}>
                            {['User', 'Game', 'Bet', 'Result', 'Payout', 'Status', 'Date'].map((h) => (
                                <th key={h} style={{
                                    padding: '0.8rem',
                                    textAlign: 'left',
                                    color: '#aaa',
                                    fontSize: '0.8rem',
                                    textTransform: 'uppercase',
                                }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {recentBets.map((bet) => (
                            <tr key={bet.id} style={{ borderBottom: '1px solid #1a1a2e' }}>
                                <td style={tdStyle}>{bet.user?.name || 'Unknown'}</td>
                                <td style={tdStyle}>{bet.game?.name || 'Unknown'}</td>
                                <td style={tdStyle}>${parseFloat(bet.amount).toFixed(2)}</td>
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
                                            fontSize: '0.75rem',
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