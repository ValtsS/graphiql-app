import { AboutPage } from '@/pages/about-page/about-page';
import { Registration } from '@/pages/Registration/Registration';
import { Authorization } from '@/pages/Authorization/Authorization';
import { GraphqlPage } from '@/pages/graphql-page/graphql-page';
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
  {
    path: '/graphql',
    element: <GraphqlPage />,
    displayInMenu: true,
    menuText: 'GraphqlPage',
  },
];
