import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function WalletPage() {
    const { user, updateBalance } = useAuth();
    const [amount, setAmount] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const res = await api.get('/transactions');
            setTransactions(res.data.data);
        } catch {
            toast.error('Failed to load transactions');
        }
    };

    const handleDeposit = async () => {
        if (!amount || parseFloat(amount) <= 0) return;
        setLoading(true);
        try {
            const res = await api.post('/wallet/deposit', { amount: parseFloat(amount) });
            updateBalance(res.data.balance);
            toast.success(`Deposited $${amount}`);
            setAmount('');
            fetchTransactions();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Deposit failed');
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async () => {
        if (!amount || parseFloat(amount) <= 0) return;
        setLoading(true);
        try {
            const res = await api.post('/wallet/withdraw', { amount: parseFloat(amount) });
            updateBalance(res.data.balance);
            toast.success(`Withdrew $${amount}`);
            setAmount('');
            fetchTransactions();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Withdrawal failed');
        } finally {
            setLoading(false);
        }
    };

    const typeColors = {
        deposit: '#4ade80',
        withdrawal: '#f87171',
        bet: '#fbbf24',
        win: '#60a5fa',
    };

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem' }}>
            <h1 style={{ color: '#e94560', marginBottom: '2rem' }}>Wallet</h1>

            <div style={{
                background: '#16213e',
                borderRadius: '12px',
                padding: '2rem',
                textAlign: 'center',
                marginBottom: '2rem',
                border: '1px solid #0f3460',
            }}>
                <p style={{ color: '#aaa', marginBottom: '0.5rem' }}>Your Balance</p>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#4ade80' }}>
                    ${parseFloat(user?.wallet?.balance || 0).toFixed(2)}
                </p>
            </div>

            <div style={{
                background: '#16213e',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '2rem',
                border: '1px solid #0f3460',
            }}>
                <input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="1"
                    style={inputStyle}
                />
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button onClick={handleDeposit} disabled={loading} style={{ ...btnStyle, background: '#4ade80', color: '#000' }}>
                        Deposit
                    </button>
                    <button onClick={handleWithdraw} disabled={loading} style={{ ...btnStyle, background: '#f87171' }}>
                        Withdraw
                    </button>
                </div>
            </div>

            <h2 style={{ marginBottom: '1rem' }}>Recent Transactions</h2>
            {transactions.length === 0 ? (
                <p style={{ color: '#aaa' }}>No transactions yet</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {transactions.map((tx) => (
                        <div key={tx.id} style={{
                            background: '#16213e',
                            borderRadius: '8px',
                            padding: '1rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            border: '1px solid #0f3460',
                        }}>
                            <div>
                                <span style={{
                                    color: typeColors[tx.type],
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    fontSize: '0.8rem',
                                }}>
                                    {tx.type}
                                </span>
                                <p style={{ color: '#aaa', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                                    {tx.description}
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{
                                    fontWeight: 'bold',
                                    color: tx.type === 'deposit' || tx.type === 'win' ? '#4ade80' : '#f87171',
                                }}>
                                    {tx.type === 'deposit' || tx.type === 'win' ? '+' : '-'}${parseFloat(tx.amount).toFixed(2)}
                                </p>
                                <p style={{ color: '#666', fontSize: '0.8rem' }}>
                                    Balance: ${parseFloat(tx.balance_after).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    ))}
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

const btnStyle = {
    flex: 1,
    padding: '0.8rem',
    borderRadius: '8px',
    border: 'none',
    color: '#fff',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: 'bold',
};