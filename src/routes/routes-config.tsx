import { Main, Authorization, Registration } from '@/pages';
import { AboutPage } from '@/pages/about-page/about-page';
import { DocumentPage } from '@/pages/document-page/document-page';
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
  {
    path: '/doc',
    element: <DocumentPage url="http://localhost:5002/graphql/" />,
    displayInMenu: true,
    menuText: 'DocTest',
  },
];
