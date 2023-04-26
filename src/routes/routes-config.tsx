import { AboutPage } from '@/pages/about-page/about-page';
import { DocumentPage } from '@/pages/document-page/document-page';
import { RegistrationPage } from '@/pages/registration-page/registration-page';
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
    element: <RegistrationPage />,
    displayInMenu: true,
    menuText: 'Main',
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
