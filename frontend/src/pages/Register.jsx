import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(name, email, password, passwordConfirmation);
            toast.success('Account created!');
            navigate('/dashboard');
        } catch (err) {
            const errors = err.response?.data?.errors;
            if (errors) {
                Object.values(errors).flat().forEach(msg => toast.error(msg));
            } else {
                toast.error(err.response?.data?.message || 'Registration failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#e94560' }}>Register</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={inputStyle}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={inputStyle}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={inputStyle}
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    required
                    style={inputStyle}
                />
                <button type="submit" disabled={loading} style={buttonStyle}>
                    {loading ? 'Creating account...' : 'Register'}
                </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '1rem', color: '#ccc' }}>
                Already have an account? <Link to="/login" style={{ color: '#e94560' }}>Login</Link>
            </p>
        </div>
    );
}

const inputStyle = {
    padding: '0.8rem',
    borderRadius: '8px',
    border: '1px solid #333',
    background: '#16213e',
    color: '#fff',
    fontSize: '1rem',
};

const buttonStyle = {
    padding: '0.8rem',
    borderRadius: '8px',
    border: 'none',
    background: '#e94560',
    color: '#fff',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: 'bold',
};