import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav style={{
            background: '#1a1a2e',
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#fff',
        }}>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <Link to="/" style={{ color: '#e94560', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    🎰 GambleHub
                </Link>
                {user && (
                    <>
                        <Link to="/dashboard" style={{ color: '#fff', textDecoration: 'none' }}>Games</Link>
                        <Link to="/wallet" style={{ color: '#fff', textDecoration: 'none' }}>Wallet</Link>
                        <Link to="/history" style={{ color: '#fff', textDecoration: 'none' }}>History</Link>
                        {user.role === 'admin' && (
                            <Link to="/admin" style={{ color: '#ffd700', textDecoration: 'none' }}>Admin</Link>
                        )}
                    </>
                )}
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {user ? (
                    <>
                        <span style={{ color: '#0f3460', background: '#e94560', padding: '0.3rem 0.8rem', borderRadius: '20px', fontWeight: 'bold' }}>
                            ${parseFloat(user.wallet?.balance || 0).toFixed(2)}
                        </span>
                        <span>{user.name}</span>
                        <button
                            onClick={handleLogout}
                            style={{
                                background: 'transparent',
                                border: '1px solid #e94560',
                                color: '#e94560',
                                padding: '0.3rem 0.8rem',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ color: '#fff', textDecoration: 'none' }}>Login</Link>
                        <Link to="/register" style={{ color: '#e94560', textDecoration: 'none' }}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}