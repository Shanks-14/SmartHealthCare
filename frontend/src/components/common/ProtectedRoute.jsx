import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500" />
          <p className="text-sm text-gray-400">Loading SmartCare…</p>
        </div>
      </div>
    );
  }

  // Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role → redirect to their own dashboard
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    const fallback =
      user.role === 'doctor' ? '/doctor/dashboard'
      : user.role === 'admin'  ? '/admin/dashboard'
      : '/patient/dashboard';
    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default ProtectedRoute;
