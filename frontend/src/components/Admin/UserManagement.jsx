import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data.data);
        } catch {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleBan = async (userId, userName, isBanned) => {
        const action = isBanned ? 'unban' : 'ban';
        if (!confirm(`Are you sure you want to ${action} ${userName}?`)) return;

        try {
            const res = await api.patch(`/admin/users/${userId}/ban`);
            toast.success(res.data.message);
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Action failed');
        }
    };

    if (loading) return <p style={{ textAlign: 'center', padding: '2rem' }}>Loading...</p>;

    return (
        <div>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr style={{ borderBottom: '1px solid #333' }}>
                        {['ID', 'Name', 'Email', 'Role', 'Balance', 'Bets', 'Status', 'Actions'].map((h) => (
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
                    {users.map((user) => (
                        <tr key={user.id} style={{
                            borderBottom: '1px solid #1a1a2e',
                            opacity: user.is_banned ? 0.5 : 1,
                        }}>
                            <td style={tdStyle}>{user.id}</td>
                            <td style={tdStyle}>{user.name}</td>
                            <td style={{ ...tdStyle, color: '#aaa' }}>{user.email}</td>
                            <td style={tdStyle}>
                                    <span style={{
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: '8px',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold',
                                        background: user.role === 'admin' ? '#1a1a3e' : '#0f3460',
                                        color: user.role === 'admin' ? '#ffd700' : '#60a5fa',
                                    }}>
                                        {user.role.toUpperCase()}
                                    </span>
                            </td>
                            <td style={{ ...tdStyle, color: '#4ade80' }}>
                                ${parseFloat(user.wallet?.balance || 0).toFixed(2)}
                            </td>
                            <td style={tdStyle}>{user.bets_count}</td>
                            <td style={tdStyle}>
                                    <span style={{
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: '8px',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold',
                                        background: user.is_banned ? '#2e0a0a' : '#0a2e1a',
                                        color: user.is_banned ? '#f87171' : '#4ade80',
                                    }}>
                                        {user.is_banned ? 'BANNED' : 'ACTIVE'}
                                    </span>
                            </td>
                            <td style={tdStyle}>
                                {user.role !== 'admin' && (
                                    <button
                                        onClick={() => handleBan(user.id, user.name, user.is_banned)}
                                        style={{
                                            padding: '0.3rem 0.8rem',
                                            borderRadius: '6px',
                                            border: 'none',
                                            background: user.is_banned ? '#4ade80' : '#f87171',
                                            color: '#000',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            fontSize: '0.8rem',
                                        }}
                                    >
                                        {user.is_banned ? 'Unban' : 'Ban'}
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const tdStyle = {
    padding: '0.8rem',
    color: '#fff',
};