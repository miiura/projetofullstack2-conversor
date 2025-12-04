import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';

// Componente de rota protegida
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="text-center py-5">Carregando...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// APP PRINCIPAL COM ROTAS
function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="text-center py-5">Carregando...</div>;
  }

  return (
    <Routes>
      {/* Redirecionar raiz baseado em autenticação */}
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} 
      />

      {/* Página de Login */}
      <Route path="/login" element={<Login />} />

      {/* Dashboard protegido com todas as funcionalidades */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Rota não encontrada */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </CurrencyProvider>
    </AuthProvider>
  );
}

export default App;
