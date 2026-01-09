import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Cashier from './pages/Cashier';
import Withdraw from './pages/Withdraw';
import AdminDashboard from './pages/AdminDashboard';
import Onboarding from './pages/Onboarding';
import Billing from './pages/Billing';
import GlobalDebugMenu from './components/GlobalDebugMenu';

const App: React.FC = () => {
  return (
    <HashRouter>
      <GlobalDebugMenu />
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cashier/:id" element={<Cashier />} />
        <Route path="/withdraw" element={<Withdraw />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;