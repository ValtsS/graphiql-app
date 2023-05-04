import { Authorization, Main, Registration, Welcome } from '@/pages';
import { About } from '@/pages/About/About';
import React from 'react';

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
    element: <Authorization />,
    displayInMenu: true,
    menuText: 'Authorization',
  },
  {
    path: '/reg',
    element: <Registration />,
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
