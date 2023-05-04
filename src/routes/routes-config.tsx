import { Authorization, Main, Registration } from '@/pages';
import { About } from '@/pages/About/About';
import React from 'react';
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
    element: <Authorization />,
    displayInMenu: true,
    menuText: 'Authorization',
  },
  {
    uuid: uuidv4(),
    path: '/reg',
    element: <Registration />,
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
];
