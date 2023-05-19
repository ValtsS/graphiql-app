import { Authorization, Main, Registration, Welcome } from '@/pages';
import React from 'react';
import { ProtectedRoute } from './protected-route';
import { v4 as uuidv4 } from 'uuid';
import { Translation } from 'react-i18next';

export const enum AccessMode {
  Always,
  LoggedIn,
  Guest,
}

export interface RouteConfig {
  uuid: string;
  path: string;
  element: () => React.ReactNode;
  displayInMenu?: boolean;
  menuText?: React.ReactNode;
  displayInRegistration?: boolean;
  displayMode: AccessMode;
}

const regRoutes: RouteConfig[] = [
  {
    uuid: uuidv4(),
    path: '/auth',
    element: () => (
      <ProtectedRoute mode={AccessMode.Guest} redirectTo="/main">
        <Authorization />
      </ProtectedRoute>
    ),
    displayInMenu: true,
    menuText: <Translation>{(t) => t('SignIn')}</Translation>,
    displayInRegistration: true,
    displayMode: AccessMode.Guest,
  },
  {
    uuid: uuidv4(),
    path: '/reg',
    element: () => (
      <ProtectedRoute mode={AccessMode.Guest} redirectTo="/main">
        <Registration />
      </ProtectedRoute>
    ),
    displayInMenu: true,
    menuText: <Translation>{(t) => t('SignUp')}</Translation>,
    displayInRegistration: true,
    displayMode: AccessMode.Guest,
  },
];

export const defaultRoutes: RouteConfig[] = [
  {
    uuid: uuidv4(),
    path: '/',
    element: () => (
      <ProtectedRoute mode={AccessMode.Always}>
        <Welcome />
      </ProtectedRoute>
    ),
    displayInMenu: true,
    menuText: <Translation>{(t) => t('Welcome')}</Translation>,
    displayMode: AccessMode.Always,
  },
  {
    uuid: uuidv4(),
    path: '/main',
    element: () => (
      <ProtectedRoute mode={AccessMode.LoggedIn}>
        <Main />
      </ProtectedRoute>
    ),
    displayInMenu: true,
    menuText: <Translation>{(t) => t('toMain')}</Translation>,
    displayMode: AccessMode.LoggedIn,
  },
  ...regRoutes,
];

export function filterByMode(routes: RouteConfig[], modes: AccessMode[]) {
  return routes.filter((route) => modes.includes(route.displayMode));
}
