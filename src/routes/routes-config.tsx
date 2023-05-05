import { Authorization, Main, Registration, Welcome, About } from '@/pages';
import React from 'react';
import { ProtectedRoute } from './protected-route';
import { v4 as uuidv4 } from 'uuid';

export interface RouteConfig {
  uuid: string;
  path: string;
  element: React.ReactNode;
  displayInMenu?: boolean;
  menuText?: string;
}

export const defaultRoutes: RouteConfig[] = [
  {
    uuid: uuidv4(),
    path: '/',
    element: <Main />,
    displayInMenu: true,
    menuText: 'Main',
  },
  {
    uuid: uuidv4(),
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
    uuid: uuidv4(),
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
    uuid: uuidv4(),
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
