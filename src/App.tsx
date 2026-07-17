/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ExecutiveDashboard } from './pages/ExecutiveDashboard';
import { SOCDashboard } from './pages/SOCDashboard';
import { IncidentDetail } from './pages/IncidentDetail';
import { Forecast } from './pages/Forecast';
import { Quantum } from './pages/Quantum';
import { Login } from './pages/Login';
import { WhatIfSimulator } from './pages/WhatIfSimulator';
import { AICopilot } from './pages/AICopilot';
import { DataPipeline } from './pages/DataPipeline';
import { isAuthenticated } from './lib/auth';

// ── Protected Route Guard ───────────────────────────────────────────────
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard/executive" replace />} />
          <Route path="dashboard/executive" element={<ExecutiveDashboard />} />
          <Route path="dashboard/soc" element={<SOCDashboard />} />
          <Route path="dashboard/incident/:id" element={<IncidentDetail />} />
          <Route path="dashboard/pipeline" element={<DataPipeline />} />
          <Route path="dashboard/forecast" element={<Forecast />} />
          <Route path="dashboard/quantum" element={<Quantum />} />
          <Route path="dashboard/simulator" element={<WhatIfSimulator />} />
          <Route path="dashboard/copilot" element={<AICopilot />} />
        </Route>
        {/* Catch-all: redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
