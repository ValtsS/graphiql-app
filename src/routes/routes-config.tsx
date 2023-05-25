import { Authorization, ErrorPage, Registration, Welcome } from '@/pages';
import React, { lazy } from 'react';
import { ProtectedRoute } from './protected-route';
import { v4 as uuidv4 } from 'uuid';
import { Translation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

const LazyMain = lazy(() => import('@/pages/Main/Main'));

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
  buttonText?: React.ReactNode;
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
        <LazyMain />
      </ProtectedRoute>
    ),
    displayInMenu: true,
    menuText: <Translation>{(t) => t('Main')}</Translation>,
    buttonText: <Translation>{(t) => t('toMain')}</Translation>,
    displayMode: AccessMode.LoggedIn,
  },
  {
    uuid: uuidv4(),
    path: '/404',
    element: () => (
      <ProtectedRoute mode={AccessMode.Always}>
        <ErrorPage />
      </ProtectedRoute>
    ),
    displayInMenu: false,
    menuText: <Translation>{(t) => t('404')}</Translation>,
    buttonText: <Translation>{(t) => t('404')}</Translation>,
    displayMode: AccessMode.Always,
  },
  {
    uuid: uuidv4(),
    path: '*',
    element: () => <Navigate to="404" replace />,
    displayInMenu: false,
    menuText: <Translation>{(t) => t('404')}</Translation>,
    buttonText: <Translation>{(t) => t('404')}</Translation>,
    displayMode: AccessMode.Always,
  },
  ...regRoutes,
];

export function filterByMode(routes: RouteConfig[], modes: AccessMode[]) {
  return routes.filter((route) => modes.includes(route.displayMode));
}
