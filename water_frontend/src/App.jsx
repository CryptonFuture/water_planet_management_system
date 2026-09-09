import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Plants from './pages/Plants';
import Reservoirs from './pages/Reservoirs';
import Quality from './pages/Quality';
import Chemicals from './pages/Chemicals';
import Maintenance from './pages/Maintenance';
import Alerts from './pages/Alerts';

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="plants" element={<Plants />} />
        <Route path="reservoirs" element={<Reservoirs />} />
        <Route path="quality" element={<Quality />} />
        <Route path="chemicals" element={<Chemicals />} />
        <Route path="maintenance" element={<Maintenance />} />
        <Route path="alerts" element={<Alerts />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
