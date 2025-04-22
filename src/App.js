import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import TerminalMap from './pages/TerminalMap';
import { TerminalProvider } from './context/TerminalContext';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (password === '1234') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-6 rounded shadow-lg w-96">
          <h2 className="text-xl font-bold mb-4">Login</h2>
          <input
            type="password"
            className="w-full p-2 border rounded mb-4"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            Unlock
          </button>
        </div>
      </div>
    );
  }

  return (
    <TerminalProvider>
      <Router>
        <div className="flex h-screen text-sm font-medium bg-gray-50 text-gray-800">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header />
            <main className="flex-1 p-6 overflow-auto">
              <Routes>
                <Route path="/" element={<Navigate to="/terminal-map" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/terminal-map" element={<TerminalMap />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </TerminalProvider>
  );
}
