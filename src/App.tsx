import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import SOCDashboard from './pages/SOCDashboard';
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import FraudDashboard from './pages/FraudDashboard';
import RiskAnalytics from './pages/RiskAnalytics';
import AIInvestigator from './pages/AIInvestigator';
import CryptographyAssets from './pages/CryptographyAssets';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center text-indigo-500">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<SOCDashboard />} />
            <Route path="executive" element={<ExecutiveDashboard />} />
            <Route path="fraud" element={<FraudDashboard />} />
            <Route path="risk" element={<RiskAnalytics />} />
            <Route path="investigator" element={<AIInvestigator />} />
            <Route path="crypto" element={<CryptographyAssets />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
