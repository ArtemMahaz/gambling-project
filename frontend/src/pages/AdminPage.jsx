import { useState } from 'react';
import AdminDashboard from '../components/Admin/Dashboard';
import UserManagement from '../components/Admin/UserManagement';
import GameManagement from '../components/Admin/GameManagement';

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState('dashboard');

    const tabs = [
        { key: 'dashboard', label: '📊 Dashboard' },
        { key: 'users', label: '👥 Users' },
        { key: 'games', label: '🎮 Games' },
    ];

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
            <h1 style={{ color: '#ffd700', marginBottom: '2rem' }}>Admin Panel</h1>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        style={{
                            padding: '0.6rem 1.2rem',
                            borderRadius: '8px',
                            border: activeTab === tab.key ? '1px solid #ffd700' : '1px solid #333',
                            background: activeTab === tab.key ? '#1a1a3e' : 'transparent',
                            color: activeTab === tab.key ? '#ffd700' : '#aaa',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            fontWeight: activeTab === tab.key ? 'bold' : 'normal',
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'dashboard' && <AdminDashboard />}
            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'games' && <GameManagement />}
        </div>
    );
}