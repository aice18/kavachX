import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import SOCDashboard from './pages/SOCDashboard';
import AICopilot from './pages/AICopilot';
import RiskAnalytics from './pages/RiskAnalytics';
import WhatIfSimulator from './pages/WhatIfSimulator';
import CryptographyAssets from './pages/CryptographyAssets';
import Solutions from './pages/Solutions';
import Documentation from './pages/Documentation';
import DataPipelineDemo from './pages/DataPipeline';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center text-electric-blue">Loading...</div>;
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
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="executive" replace />} />
            <Route path="executive" element={<ExecutiveDashboard />} />
            <Route path="soc" element={<SOCDashboard />} />
            <Route path="risk" element={<RiskAnalytics />} />
            <Route path="what-if" element={<WhatIfSimulator />} />
            <Route path="copilot" element={<AICopilot />} />
            <Route path="crypto" element={<CryptographyAssets />} />
            <Route path="pipeline-demo" element={<DataPipelineDemo />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
