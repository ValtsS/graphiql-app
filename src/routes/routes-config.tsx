import { ErrorPage, Main } from '@/pages';
import React from 'react';
import { Translation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

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

export const defaultRoutes: RouteConfig[] = [

  {
    uuid: uuidv4(),
    path: '/',
    element: () => (
        <Main />
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
        <ErrorPage />
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

];

export function filterByMode(routes: RouteConfig[], modes: AccessMode[]) {
  return routes.filter((route) => modes.includes(route.displayMode));
}
