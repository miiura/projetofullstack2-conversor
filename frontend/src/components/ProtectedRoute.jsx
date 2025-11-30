import React from 'react';
import { Navigate } from 'react-router-dom';

function isLogged() {
  return !!localStorage.getItem('token');
}

export default function ProtectedRoute({ children }) {
  if (!isLogged()) return <Navigate to="/login" replace />;
  return children;
}
