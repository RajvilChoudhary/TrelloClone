import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import HomePage from './pages/HomePage';
import BoardPage from './pages/BoardPage';

export default function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {!isHomePage && <Header />}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
        <Routes>
          <Route path="/"          element={<HomePage />} />
          <Route path="/board/:id" element={<BoardPage />} />
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
