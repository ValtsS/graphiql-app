import { Authorization, Main, Registration, Welcome, About } from '@/pages';
import React from 'react';
import { ProtectedRoute } from './protected-route';

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  displayInMenu?: boolean;
  menuText?: string;
}

export const defaultRoutes: RouteConfig[] = [
  {
    path: '/',
    element: <Main />,
    displayInMenu: true,
    menuText: 'Main',
  },
  {
    path: '/auth',
    element: (
      <ProtectedRoute>
        <Authorization />
      </ProtectedRoute>
    ),
    displayInMenu: true,
    menuText: 'Authorization',
  },
  {
    path: '/reg',
    element: (
      <ProtectedRoute>
        <Registration />
      </ProtectedRoute>
    ),
    displayInMenu: true,
    menuText: 'Registration',
  },
  {
    path: '/about',
    element: <About />,
    displayInMenu: true,
    menuText: 'About',
  },
  {
    path: '/welcome',
    element: <Welcome />,
    displayInMenu: true,
    menuText: 'Welcome',
  },
];
