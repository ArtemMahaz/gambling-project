import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WalletPage from './pages/WalletPage';
import GamePage from './pages/GamePage';
import HistoryPage from './pages/HistoryPage';
import AdminPage from './pages/AdminPage';


export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <div style={{ minHeight: '100vh', background: '#0f0f23', color: '#fff' }}>
                    <Navbar />
                    <Toaster position="top-right" />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={
                            <ProtectedRoute><Dashboard /></ProtectedRoute>
                        } />
                        <Route path="/wallet" element={
                            <ProtectedRoute><WalletPage /></ProtectedRoute>
                        } />
                        <Route path="/games/:slug" element={
                            <ProtectedRoute><GamePage /></ProtectedRoute>
                        } />
                        <Route path="/history" element={
                            <ProtectedRoute><HistoryPage /></ProtectedRoute>
                        } />
                        <Route path="/admin" element={
                            <ProtectedRoute adminOnly={true}><AdminPage /></ProtectedRoute>
                        } />
                    </Routes>
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}