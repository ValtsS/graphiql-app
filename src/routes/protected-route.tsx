import useAuth from '@/custom-hooks/useAuth';
import { CircularProgress } from '@mui/material';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { AccessMode } from './routes-config';

export const ProtectedRoute = ({ children, mode }: { children: JSX.Element; mode: AccessMode }) => {
  const { currentUser, ready } = useAuth();
  if (!ready) return <CircularProgress />;
  if (mode == AccessMode.Always) return children;

  const accessGranted =
    (mode == AccessMode.Guest && currentUser === null) ||
    (mode == AccessMode.LoggedIn && currentUser);

  return accessGranted ? children : <Navigate to="/" />;
};
