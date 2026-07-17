/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
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
import { Landing } from './pages/Landing';
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
        <Route path="/" element={<Landing />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard/executive" replace />} />
          <Route path="executive" element={<ExecutiveDashboard />} />
          <Route path="soc" element={<SOCDashboard />} />
          <Route path="incident/:id" element={<IncidentDetail />} />
          <Route path="pipeline" element={<DataPipeline />} />
          <Route path="forecast" element={<Forecast />} />
          <Route path="quantum" element={<Quantum />} />
          <Route path="simulator" element={<WhatIfSimulator />} />
          <Route path="copilot" element={<AICopilot />} />
        </Route>
        {/* Catch-all: redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
