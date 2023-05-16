import useAuth from '@/custom-hooks/useAuth';
import React from 'react';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { currentUser } = useAuth();
  return !currentUser ? children : <Navigate to="/" />;
};
