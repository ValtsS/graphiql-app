import { AboutPage } from '@/pages/About-page/About-page';
import { Registration } from '@/pages/Registration/Registration';
import { Authorization } from '@/pages/Authorization/Authorization';
import { Main } from '@/pages';
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
