import { Authorization, Main, Registration, Welcome } from '@/pages';
import React from 'react';
import { ProtectedRoute } from './protected-route';
import { v4 as uuidv4 } from 'uuid';
import { Translation } from 'react-i18next';

export const enum DisplayMode {
  Always,
  LoggedIn,
  Guest,
}

export interface RouteConfig {
  uuid: string;
  path: string;
  element: React.ReactNode;
  displayInMenu?: boolean;
  menuText?: React.ReactNode;
  displayInRegistration?: boolean;
  displayMode: DisplayMode;
}

const regRoutes: RouteConfig[] = [
  {
    uuid: uuidv4(),
    path: '/auth',
    element: (
      <ProtectedRoute>
        <Authorization />
      </ProtectedRoute>
    ),
    displayInMenu: true,
    menuText: <Translation>{(t) => t('SignIn')}</Translation>,
    displayInRegistration: true,
    displayMode: DisplayMode.Guest,
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
    menuText: <Translation>{(t) => t('SignUp')}</Translation>,
    displayInRegistration: true,
    displayMode: DisplayMode.Guest,
  },
];

export const defaultRoutes: RouteConfig[] = [
  {
    uuid: uuidv4(),
    path: '/',
    element: <Welcome />,
    displayInMenu: true,
    menuText: <Translation>{(t) => t('Welcome')}</Translation>,
    displayMode: DisplayMode.Always,
  },
  {
    uuid: uuidv4(),
    path: '/main',
    element: <Main />,
    displayInMenu: true,
    menuText: <Translation>{(t) => t('toMain')}</Translation>,
    displayMode: DisplayMode.LoggedIn,
  },
  ...regRoutes,
];

export function filterByMode(routes: RouteConfig[], modes: DisplayMode[]) {
  return routes.filter((route) => modes.includes(route.displayMode));
}
