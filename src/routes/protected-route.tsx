import { useAppContext } from '@/provider';
import React from 'react';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { auth } = useAppContext();
  return !auth?.getUser() ? children : <Navigate to="/" />;
};
