import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/utils/constants';

// Pages
import Home from '@/pages/Home';
import OmniGrid from '@/pages/OmniGrid';
import Dashboard from '@/pages/Dashboard';
import Explore from '@/pages/Explore';
import VaultMesh from '@/pages/VaultMesh';
import Sectors from '@/pages/Sectors';
import Treaty from '@/pages/Treaty';
import BaobabTerminal from '@/pages/BaobabTerminal';
import SeedwaveAdmin from '@/pages/SeedwaveAdmin';
import Checkout from '@/pages/Checkout';
import Login from '@/pages/Login';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.OMNIGRID} element={<OmniGrid />} />
        <Route path={ROUTES.EXPLORE} element={<Explore />} />
        <Route path={ROUTES.VAULTMESH} element={<VaultMesh />} />
        <Route path={ROUTES.SECTORS} element={<Sectors />} />
        <Route path={ROUTES.TREATY} element={<Treaty />} />
        <Route path={ROUTES.BAOBAB} element={<BaobabTerminal />} />
        <Route path={ROUTES.CHECKOUT} element={<Checkout />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />

        {/* Protected Routes */}
        <Route 
          path={ROUTES.DASHBOARD} 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path={ROUTES.ADMIN} 
          element={
            <ProtectedRoute requireAdmin>
              <SeedwaveAdmin />
            </ProtectedRoute>
          } 
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </Router>
  );
};

export default App;
