import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // ✅ added Navigate
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import TerminalMap from './pages/TerminalMap';
import { TerminalProvider } from './context/TerminalContext';

export default function App() {
  return (
    <TerminalProvider>
      <Router>
        <div className="flex h-screen text-sm font-medium bg-gray-50 text-gray-800">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header />
            <main className="flex-1 p-6 overflow-auto">
              <Routes>
                {/* 👇 Redirect root to /terminal-map */}
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
