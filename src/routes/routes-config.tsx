import { AboutPage, Authorization, Main, Registration } from '@/pages';
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
    element: <AboutPage />,
    displayInMenu: true,
    menuText: 'About',
  },
];
